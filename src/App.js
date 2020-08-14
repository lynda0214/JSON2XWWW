import React, {Component} from 'react';
import Clipboard from 'react-clipboard.js';
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noteText: '',
            noteCss: 'note'
        }
    }

    convertJson2XWWW = (value, isPaste) => {
        let obj;
        try {
            obj = JSON.parse(value);
        } catch (e) {
            if (isPaste) {
                console.warn('please paste valid in JSON format');
                this.popNote('please paste valid in JSON format', 'warn');
            }
            return;
        }
        if (isPaste) {
            setTimeout(() => {
                this.refs.jsonTextArea.editor.getSession().setValue('');
                this.refs.jsonTextArea.editor.getSession().setTabSize(2);
                this.refs.jsonTextArea.editor.getSession().setUseWrapMode(true);
                this.refs.jsonTextArea.editor.getSession().setValue(JSON.stringify(obj, null, 2))
            }, 0);
        }
        this.refs.xwwwTextArea.editor.getSession().setValue(this.convertObj2XWWW(obj));
    };

    convertObj2XWWW = (obj) => {
        let result = '';
        for (let key in obj) {
            result += `${key}:${obj[key]}\n`;
        }
        return result;
    };

    getCopyText = () => {
        return this.refs.xwwwTextArea.editor.getSession().getValue();
    };

    onCopySuccess = () => {
        console.info('successfully copied');
        this.popNote('successfully copied', 'success');
    };

    popNote = (noteText, noteCss) => {
        this.setState({noteText, noteCss: `note open ${noteCss}`});
        setTimeout(() => this.setState({noteCss: `note ${noteCss}`}), 3000);
    };

    render() {
        const {noteText, noteCss} = this.state;
        const noteClassNames = `note ${noteCss}`;
        return (
            <React.Fragment>
                <div className="App">
                    <div>
                        <h2>paste JSON below</h2>
                        <AceEditor
                            ref="jsonTextArea"
                            className="input"
                            mode="json"
                            wrapEnabled="true"
                            theme="github"
                            onChange={(value) => this.convertJson2XWWW(value, false)}
                            onPaste={(value) => this.convertJson2XWWW(value, true)}
                            name="json_input"
                            editorProps={{$blockScrolling: true}}
                        />
                    </div>
                    <div>
                        <h2>x-www-form-urlencoded appears here</h2>
                        <AceEditor
                            ref="xwwwTextArea"
                            className="output"
                            mode="json"
                            wrapEnabled="true"
                            theme="github"
                            name="xwww_output"
                            editorProps={{$blockScrolling: true}}
                        />
                        <Clipboard component="div" option-text={this.getCopyText} onSuccess={this.onCopySuccess}
                                   className="button">
                            Copy
                        </Clipboard>
                    </div>
                </div>
                <div className="note-container">
                    <div className={noteClassNames}>
                        {noteText}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default App;
