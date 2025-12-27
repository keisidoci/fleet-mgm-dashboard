import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { router } from "./routes";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  );
}

export default App;
