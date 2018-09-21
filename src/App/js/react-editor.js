import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';


class Editor extends React.Component {
    editor = null;
    monaco = null

    constructor(props) {
        super(props);
    }

    editorDidMount = (editor, monaco) => {
        this.props.editorDidMount(editor, monaco);
        this.editor = editor;
        this.monaco = monaco;

        if (this.props.eventId !== null)
            window.addEventListener(this.props.eventId, ev => {
                switch (ev.detail.eventType) {
                    case "cursorMove":
                        this.editor.setSelection(ev.detail.range);
                        this.editor.focus();
                        this.editor.revealRangeInCenter(ev.detail.range);
                        break;
                    default:
                        break;
                }
            });
    }

    onChange = (newValue, e) => {
        this.props.onChange(newValue);
    }

    onResize = () => {
        if (this.editor !== null)
            this.editor.layout();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.errors !== this.props.errors) {
            this.monaco.editor.setModelMarkers(this.editor.getModel(), "FSharpErrors", this.props.errors);
            this.onResize();
        }
    }

    render() {
        let display = this.props.isHidden ? "none" : "block";
        return (
            <div style={{ height: '100%', overflow: 'hidden', display: display }}>
                <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
                <MonacoEditor
                    value={this.props.value}
                    options={this.props.options}
                    onChange={this.onChange}
                    editorDidMount={this.editorDidMount}
                // requireConfig={requireConfig}
                />
            </div>
        );
    }
}

function noop() { }

Editor.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    editorDidMount: PropTypes.func,
    options: PropTypes.object,
    errors: PropTypes.array,
    eventId: PropTypes.string,
    isHidden: PropTypes.bool
};

Editor.defaultProps = {
    onChange: noop,
    value: "",
    editorDidMount: noop,
    options: null,
    errors: [],
    eventId: null,
    isHidden: false
};

export default Editor;