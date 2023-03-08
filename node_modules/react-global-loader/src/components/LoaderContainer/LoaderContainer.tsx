import React from "react";

const LoaderContainer = ({
  backgroundColor = "#0000003a",
  opacity = 1,
  justify = "center",
  align = "center",
  defaultText = "Loading..",
  defaultShow = false,
  id = "rgl-overlay",
  autoHide = false,
  hideDuration = 3000,
  children,
}: {
  backgroundColor?: string;
  opacity?: number;
  justify?: string;
  align?: string;
  defaultText?: string;
  defaultShow?: boolean;
  id?: string;
  autoHide?: boolean;
  hideDuration?: number;
  children?: any;
}) => {
  return (
    <div
      id={id}
      data-auto={autoHide}
      data-duration={hideDuration}
      style={{ display: defaultShow ? "block" : "none" }}
    >
      <div
        id={`${id}-bg`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1000,
          opacity: opacity,
          background: backgroundColor,
          transition: "opacity 0.2s ease",
        }}
      ></div>
      <div
        id={`${id}-container`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10001,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: justify,
            alignItems: justify,
          }}
        >
          {children ? children : defaultText}
        </div>
      </div>
    </div>
  );
};

export default LoaderContainer;
