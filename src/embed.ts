import ky from "ky";

type Dashboard = {
  id: number;
  slug: string;
  name: string;
  tags: Array<string>;
  is_archived: boolean;
  is_draft: boolean;
  can_edit: boolean;
  widgets: Array<Widget>;
};

type Widget = {
  id: number;
  dashboard_id: number;
  width: number;
  text: string;
  visualization: Visualization;
  options: {
    isHidden: boolean;
    parameterMappings: {
      [key: string]: {
        type: string;
        mapTo: string;
        name: string;
        value: string;
        title: string;
      };
    };
    position: {
      autoHeight: boolean;
      sizeX: number;
      sizeY: number;
      maxSizeX: number;
      maxSizeY: number;
      minSizeX: number;
      minSizeY: number;
      col: number;
      row: number;
    };
  };
};

type Visualization = {
  id: number;
};

export async function embedVars(
  url: string,
  apiKey: string
): Promise<{ url: string; name: string }> {
  console.log("embedVars:", url, apiKey);

  const { origin, pathname, searchParams } = new URL(url);
  const options = {
    headers: {
      Authorization: `${apiKey}`,
    },
    prefixUrl: `${origin}/api`,
  };

  const id = pathname.replace(/^\/dashboard\/(.*)/, "$1");
  const params = new Map<string, string>();
  searchParams.forEach((value, key) => {
    if (key.startsWith("p_")) {
      params.set(key.replace(/^p_/, ""), value);
    }
  });
  if (params.size === 0) {
    throw new Error("This URL has no parameters");
  }

  const src = await ky
    .get(`dashboards/${id}`, {
      ...options,
    })
    .json<Dashboard>();
  if (src.widgets.length === 0) {
    throw new Error("This dashboard has no widgets");
  }
  if (
    !src.widgets.some((widget) =>
      Object.entries(widget.options.parameterMappings).some(
        ([_, map]) => map.type === "dashboard-level"
      )
    )
  ) {
    throw new Error("This dashboard has no dashboard-level variables");
  }

  const dest = await ky
    .post(`dashboards`, {
      ...options,
      json: {
        name: `${src.name} (${Array.from(params.entries())
          .map((e) => e.join(":"))
          .join(", ")})`,
      },
    })
    .json<Dashboard>();

  const updated = await ky
    .post(`dashboards/${dest.id}`, {
      ...options,
      json: {
        tags: src.tags,
        is_draft: src.is_draft,
        is_archived: src.is_archived,
        widgets: src.widgets,
      },
    })
    .json<Dashboard>();

  await Promise.all(
    src.widgets.map((widget) =>
      ky.post("widgets", {
        ...options,
        json: {
          dashboard_id: updated.id,
          width: widget.width,
          text: widget.text,
          options: {
            parameterMappings: Object.fromEntries(
              Object.entries(widget.options.parameterMappings).map(
                ([key, map]) => [
                  key,
                  map.type === "dashboard-level"
                    ? {
                        ...map,
                        type: "static-value",
                        value: params.get(key),
                      }
                    : map,
                ]
              )
            ),
            isHidden: widget.options.isHidden,
            position: widget.options.position,
          },
          visualization_id: widget.visualization.id,
        },
      })
    )
  );

  return {
    url: `${origin}/dashboard/${dest.slug}`,
    name: dest.name,
  };
}
