import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import { Tabs } from "antd";
import { TabPaneProps, TabsProps } from "antd/lib/tabs";

interface ITabPane extends TabPaneProps {
  label: React.ReactNode | string;
  url: string;
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

interface IRoutedTabsProps extends RouteComponentProps {
  tabPanes: ITabPane[];
  tabProps?: TabsProps;
  rootUrl: string;
}

export const RoutedTabs = (props: IRoutedTabsProps) => {
  // need to explicit manage active tab, there are different eways to activate
  // it, not just onChange event
  const [activeTab, setActiveTab] = React.useState();

  // Remove defaultActiveKey from tabProps
  // to keep url and active tab in sync.
  const tabProps = React.useMemo(() => {
    if (!props.tabProps) return undefined;
    const { defaultActiveKey, ...rest } = props.tabProps;
    return rest;
  }, [props.tabProps]);

  // This effect is required to keep url and active tab in sync on mount time
  React.useEffect(() => {
    const removeEndingSlashes = (path: string) => {
      while (path[path.length - 1] === "/" && path.length > 0)
        path = path.slice(0, path.length - 1);
      return path;
    };
    const path = removeEndingSlashes(props.location.pathname.toLowerCase());
    const rootPath = removeEndingSlashes(props.match.path.toLowerCase());

    // If props.match.path is a root path "redirect"
    // to the default or first tab.
    if (path === rootPath) {
      const nextActiveTab =
        props.tabProps && props.tabProps.defaultActiveKey
          ? props.tabProps.defaultActiveKey
          : props.tabPanes[0].url;
      props.history.push(`${props.rootUrl}/${nextActiveTab}`);
      setActiveTab(nextActiveTab);
    } else {
      // Otherwise activate tab that matches url.
      const nextActiveTab = removeEndingSlashes(props.location.pathname)
        .split("/")
        .pop();
      setActiveTab(nextActiveTab);
    }
  }, [
    props.history,
    props.location.pathname,
    props.match.path,
    props.rootUrl,
    props.tabPanes,
    props.tabProps
  ]);

  // Click on tab changes url
  const onTabChange = React.useCallback(
    (activeKey: string) => {
      props.history.push(`${props.rootUrl}/${activeKey}`);
      // next line will be done in effect above
      // setActiveTab(activeKey);
    },
    [props]
  );

  // Rendering
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const tabPaneComponents = React.useMemo(
    () =>
      props.tabPanes.map(tabPane => (
        <Tabs.TabPane tab={tabPane.label} key={tabPane.url} />
      )),
    [props.tabPanes]
  );

  const routes = React.useMemo(
    () =>
      props.tabPanes.map(tabPane => (
        <Route
          path={`${props.rootUrl}/${tabPane.url}`}
          key={tabPane.url}
          exact
          component={tabPane.component}
        />
      )),
    [props.rootUrl, props.tabPanes]
  );

  return (
    <>
      <Tabs {...tabProps} onChange={onTabChange} activeKey={activeTab}>
        {tabPaneComponents}
      </Tabs>
      <Switch>{routes}</Switch>
    </>
  );
};
