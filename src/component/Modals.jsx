import React from "react";

const Modals = (props) => {
  return (
    <div
      className={`${
        props.modal ? "block" : "hidden"
      } modal-container bg-[#00000020] w-[100%] h-[100%] fixed top-0 left-0 z-10`}
    >
      <div className="modal bg-[#fff] w-[30%] rounded-[10px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
        {props.children}
      </div>
    </div>
  );
};

export default Modals;
