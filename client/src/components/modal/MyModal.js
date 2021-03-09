import React from "react";
import "./MyModal.css";

export default function MyModal(props) {
  return (
    <div id="myModal" className="container">
      {props.title && (
        <header className="myModalHeader">
          <h2>{props.title}</h2>
        </header>
      )}
      <section className="modalSection">{props.children}</section>
      <section className="modalActions">
        {props.canCancel && <button className="btn blue">Cancel</button>}
        {props.canConfirm && <button className="btn blue">Confirm</button>}
      </section>
    </div>
  );
}
