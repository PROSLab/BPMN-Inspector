# React Global Loader

Simple Customizable Global React Loader. [Demo page](https://shafeequeom.github.io/react-global-loader-demo/)

## Install

```js
npm i react-global-loader
```

## Simple Usage

#### Import LoaderContainer in App.js or root js

```js
import { LoaderContainer } from "react-global-loader";

export default function App() {
  return (
    <div>
      <LoaderContainer />
    </div>
  );
}
```

#### Or LoaderContainer with default spinner component

```js
import { LoaderContainer, DefaultSpinner } from "react-global-loader";

export default function App() {
  return (
    <div>
      <LoaderContainer>
        <DefaultSpinner />
      </LoaderContainer>
    </div>
  );
}
```

#### Or LoaderContainer with a image file

```js
import { LoaderContainer } from "react-global-loader";
import FidgetLoader from "./loader.gif";

export default function App() {
  return (
    <div>
      <LoaderContainer>
        <img src={FidgetLoader} alt="loading" />
      </LoaderContainer>
    </div>
  );
}
```

#### Usage inside pages, components and services

```js
import { loader } from "react-global-loader";

export default function PageName() {
  const showLoader = () => {
    loader.show();
  };

  const hideLoader = () => {
    loader.hide();
  };

  useEffect(() => {
    showLoader();

    setTimeout(() => {
      hideLoader();
    }, 3000);
  });

  return <div>Page 1</div>;
}
```

## Extended Usage

```js
import { LoaderContainer, loader } from "react-global-loader";

export default function App() {
  const showLoader = () => {
    loader.show();
  };

  const hideLoader = () => {
    loader.hide();
  };

  useEffect(() => {
    showLoader();

    setTimeout(() => {
      hideLoader();
    }, 3000);
  });

  const Arrow = () => (
    <div
      style={{
        width: 0,
        height: 0,
        borderTop: "10px solid transparent",
        borderRight: "20px solid red",
        borderBottom: "10px solid transparent",
      }}
    ></div>
  );

  return (
    <div>
      <LoaderContainer opacity={0.5} backgroundColor="#ccc">
        <div style={{ display: "inline-flex" }}>
          <Arrow />
          <div style={{ marginLeft: "10px" }}> Custom Loader</div>
        </div>
      </LoaderContainer>
    </div>
  );
}
```

## Using with react-loader-spinner

If you are familiar with react-loader spinner please do check out the [official page](https://mhnpd.github.io/react-loader-spinner/) and [npm page](https://www.npmjs.com/package/react-loader-spinner) .

```js
import { Audio } from "react-loader-spinner";
import { LoaderContainer, loader } from "react-global-loader";

export default function App() {
  useEffect(() => {
    loader.show();
    setTimeout(() => {
      loader.hide();
    }, 5000);
  });
  return (
    <LoaderContainer>
      <Audio
        height="100"
        width="100"
        color="#4fa94d"
        ariaLabel="audio-loading"
        wrapperStyle={{}}
        wrapperClass="wrapper-class"
        visible={true}
      />
    </LoaderContainer>
  );
}
```

## Container Properties

| Property        | Default Value | Type    | Description                                                              |
| --------------- | ------------- | ------- | ------------------------------------------------------------------------ |
| opacity         | 1             | number  | Set Opacity level for overlay background                                 |
| backgroundColor | #0000003a     | string  | Set background color for overlay                                         |
| justify         | center        | string  | Horizontal alignment of loader content (flex)                            |
| align           | center        | string  | Horizontal alignment of loader content (flex)                            |
| defaultText     | Loading..     | string  | Default text for loader                                                  |
| defaultShow     | false         | boolean | Set to true if you want to show by default                               |
| id              | rgl-overlay   | string  | HTML id value, if you want to have multiple type of loaders              |
| autoHide        | false         | boolean | If you want to automatically hide the loader after a certain time period |
| hideDuration    | 3000          | number  | Increase or decrease the value if autoHide is enabled                    |

## Loader Properties

| Property | Default Value | Type   | Description                                           |
| -------- | ------------- | ------ | ----------------------------------------------------- |
| id       | rgl-overlay   | string | Pass Id if multiple loader are there to hide and show |
