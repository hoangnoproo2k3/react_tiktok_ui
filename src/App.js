import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { publicRoutes } from '~/routes';
import { DefaultLayout } from "~/components/Layout";
import { Fragment } from "react";
function App() {
  return (


    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {

            const Page = route.component;

            let Layout = DefaultLayout
            console.log(route)
            if (route.layout_page) {
              Layout = route.layout_page
            } else if (route.layout_page === null) {
              Layout = Fragment
            }
            return <Route key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              } />
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
