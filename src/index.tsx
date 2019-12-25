import * as React from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps,
  Link
} from "react-router-dom";
import "antd/dist/antd.css";
import "./styles.css";

import { Icon } from "antd";
import { RoutedTabs } from "./RoutedTabs";

const DemoTable = (props: any) => <h1>Demo table</h1>;
const DemoCards = (props: any) => <h1>Demo cards</h1>;
const EntityPage = (props: any) => <h1>Entity page</h1>;

const CollectionPage = (props: RouteComponentProps) => (
  <div>
    <pre>{props.match.url}</pre>
    <div>
      <RoutedTabs
        rootUrl={props.match.url}
        tabProps={{ defaultActiveKey: "table" }}
        tabPanes={[
          {
            label: (
              <span>
                <Icon type="table" />
                <span>Table</span>
              </span>
            ),
            component: DemoTable,
            url: "table"
          },
          {
            label: "Cards",
            component: DemoCards,
            url: "cards"
          }
        ]}
        {...props}
      />
    </div>
  </div>
);

const AlwaysVisible = (props: any) => (
  <p>
    <code>antd</code> tab control with the client routes
    <br />
    Try <Link to="/demo">Collection object</Link>
    {" | "}
    <Link to="/demo/123">Entity object</Link>
  </p>
);
function App(props: any) {
  return (
    <>
      <Router>
        <div>
          <AlwaysVisible />
          <Switch>
            <Route path="/demo/:id(\d+)" component={EntityPage} exact={false} />
            <Route path="/demo" component={CollectionPage} exact={false} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
