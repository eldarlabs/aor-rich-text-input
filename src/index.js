import debounce from "lodash.debounce";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Quill from "quill";

require("./RichTextInput.css");

var Link = Quill.import("formats/link");

class MyLink extends Link {
  static create(value) {
    let node = super.create(value);
    value = this.sanitize(value);
    node.setAttribute("href", value);
    if (value.startsWith("https://") || value.startsWith("http://")) {
      //external link
    } else {
      // internal link
      node.removeAttribute("target");
    }
    return node;
  }
}

Quill.register(MyLink);
class RichTextInput extends Component {
  componentDidMount() {
    const { input: { value }, toolbar } = this.props;

    this.quill = new Quill(this.divRef, {
      modules: {
        toolbar,
        clipboard: {
          matchVisual: false,
        },
      },
      theme: "snow",
    });

    this.quill.pasteHTML(value);

    this.editor = this.divRef.querySelector(".ql-editor");
    this.quill.on("text-change", debounce(this.onTextChange, 500));
  }

  componentWillUnmount() {
    this.quill.off("text-change", this.onTextChange);
    this.quill = null;
  }

  onTextChange = () => {
    this.props.input.onChange(this.editor.innerHTML);
  };

  updateDivRef = ref => {
    this.divRef = ref;
  };

  render() {
    return (
      <div className="aor-rich-text-input">
        <div ref={this.updateDivRef} />
      </div>
    );
  }
}

RichTextInput.propTypes = {
  addField: PropTypes.bool.isRequired,
  addLabel: PropTypes.bool.isRequired,
  input: PropTypes.object,
  label: PropTypes.string,
  options: PropTypes.object,
  source: PropTypes.string,
  toolbar: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
};

RichTextInput.defaultProps = {
  addField: true,
  addLabel: true,
  options: {},
  record: {},
  toolbar: true,
};

export default RichTextInput;
