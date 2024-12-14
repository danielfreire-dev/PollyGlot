import React from "react";
import pollyglot from "/assets/parrot.png";

export default function Header() {
  return (
    <header className="header">
      <img src="{pollyglot}" className="header--image" alt="troll face" />
      <div>
        <h2 className="header--title">pollyglot</h2>
        <h4 className="header--project">React Course - Project 3</h4>
      </div>
    </header>
  );
}
