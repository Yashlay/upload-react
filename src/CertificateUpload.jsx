import React from "react";
import {Document, Page, pdfjs} from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import DragDrop from "./DragDrop";
import api from './appApi';
import Request from 'axios-request-handler';
import stub from './stubs/scratch.json';
const INITIATE_PROCESSING_URL = window.location.protocol + '//' + window.location.hostname + "/listing/";
const POLLING_INTERVAL = 10000;

class CertificateUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            file: "",
            result: [],
            maxSize: 1,
            vendor: 1,
            fileId: -1
        };
        pdfjs.GlobalWorkerOptions.workerSrc =
            `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    }

    componentDidMount() {
        this.setState({
            vendor: 1
        });
    }

    onDocumentLoadSuccess({numPages}) {
        this.setState({
            numPages: numPages
        });
    }

    parseResults(result) {
        let results = [];
        let maxSize = 1;
        for (let key of Object.keys(result)) {
            let row = result[key];
            if (typeof row === "string") {
                let rowRes = {};
                rowRes.name = "";
                rowRes.value = row;
                results.push(rowRes);
            } else if (typeof row === "object" && Array.isArray(row) && row.length > 0) {
                if (typeof row[0] === "string" && row.length === 2) {
                    let rowRes = {};
                    rowRes.name = row[0];
                    rowRes.value = row[1];
                    results.push(rowRes);
                } else if (typeof row[0] === "object" && Array.isArray(row[0])) {
                    maxSize = Math.max(maxSize, row.length);
                    for (let index in row) {
                        if (key.includes("_header") > 0) {
                            let rowRes = {};
                            let rowVal = [];
                            rowRes.name = row[index].join();
                            rowRes.value = rowVal;
                            results.push(rowRes);
                        } else {
                            if (row.length > 0) {
                                for (let a of row) {
                                    for (let ind in a) {
                                        let len = results.length - a.length + Number(ind);
                                        if (results[len] && results[len].value && Array.isArray(results[len].value)) {
                                            results[len].value.push(a[ind]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (typeof row[0] === "object") {
                    for (let r of row) {
                        for (let k in r) {
                            results.push({name: k, value: r[k]});
                        }
                    }
                }
            }

        }
        return {maxSize: maxSize, resultant: results};
    }

    extract() {
        if (!this.state.file) {
            window.alert("No file selected. Please upload file.");
            return;
        }
        // todo uncomment below 3 lines for stubs
        // let parsedResults = this.parseResults(stub.data);
        // this.setState({
        //     result: parsedResults.resultant,
        //     maxSize: parsedResults.maxSize
        // });
        const formData = new FormData();
        formData.append(
            "file",
            this.state.file,
            this.state.file.name
        );
        api.upload(formData, this.state.vendor).then((response) => {
            if (response.status === 200) {
                this.setState({
                    fileId: response.data.fileID
                });
                this.startProcessing(response.data.fileID).then((response) => {
                    let parsedResults = this.parseResults(response);
                    this.setState({
                        result: parsedResults.resultant,
                        maxSize: parsedResults.maxSize
                    });
                }).catch((err) => alert(err));
            } else {
                alert("Error uploading the file.");
            }
        }).catch((error) => {
            alert(error.response.data.errorMessage);
        });
    }

    clear() {
        this.setState({
            file: "",
            result: [],
            maxSize: 1
        })
    }

    startProcessing(fileId) {
        return new Promise((resolve) => {
            let data = {};
            let dataReceived = false;
            const initProcessing = new Request(INITIATE_PROCESSING_URL + fileId);
            initProcessing.poll(POLLING_INTERVAL).get((res) => {
                if (res.data.status === "Processed") {
                    dataReceived = true;
                    data = res.data.data;
                    return false;
                }
            });
            if (dataReceived) {
                resolve(data);
            }
        });
    }

    handleDrop = (files) => {
        if (files.length === 1) {
            if (files[0].type === "application/pdf") {
                this.setState({file: files[0]})
            } else {
                alert('Please upload pdf files only.');
            }
        } else {
            alert('Please upload only 1 file.');
        }
    }

    previousPage() {
        this.changePage(-1);
    }

    onChangeOfSelect(e) {
        this.setState({
            vendor: Number(e.target.value)
        });
    }

    nextPage() {
        this.changePage(1);
    }

    changePage(offset) {
        const pageNumber = this.state.pageNumber;
        this.setState({
            pageNumber: pageNumber + offset
        });
    }

    render() {
        return (
            <div className="App">
                <div style={{'borderBottom': '1px solid grey', 'marginBottom': '10px'}}>
                    <img src='https://www.gerab.com/images/logo.png' width='75px' height='75px' className='App-logo'
                         alt="logo"/>
                </div>
                <div className="flex flex-col creds">
                    <div className="title">Digital Certificate - MDM</div>
                    <div className="subTitle">
                        <div>
                            Welcome to Digital Certification Application
                        </div>
                    </div>
                </div>

                <div className="uploadSegment">
                        <div>
                            <div className="uploadTitle">Select Vendor</div>
                            <div>
                                <select id='vendorSelect' onChange={(e) =>
                                    this.onChangeOfSelect(e)
                                }>
                                    <option value={1}>Tenaris</option>
                                    <option value={2}>Heng Yang</option>
                                </select>
                            </div>
                        </div>
                    {!this.state.file ?
                        <div>
                            <div className="uploadTitle">Select the certificate (PDF) you want to compare</div>
                            <DragDrop handleDrop={this.handleDrop}>
                                <div style={{
                                    height: 200,
                                    width: 325,
                                    backgroundColor: "#D30803",
                                    backgroundImage: "linear-gradient(180deg, #D30803 0%, #FEB2B0 74%)",
                                    border: "2px dashed red",
                                    borderRadius: "10px"
                                }}>
                                    <div style={{"marginTop": "45px", "marginBottom": "20px", "color": "white"}}>Drag and drop files here
                                    </div>
                                    <div style={{"marginBottom": "20px", "color": "white"}}>- OR -</div>
                                    <label htmlFor="dragFileUpload" className="custom-file-upload">
                                        Browse file
                                    </label>
                                    <input id="dragFileUpload"
                                           onChange={(fileChangeEvent) => {
                                               this.setState({
                                                   file: fileChangeEvent.target.files[0]
                                               })
                                           }}
                                           accept="application/pdf"
                                           type="file"
                                    />
                                </div>
                            </DragDrop>
                        </div>
                        : ""
                    }

                    <div className="previewPdf">
                        <Document
                            file={this.state.file}
                            onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
                        >
                            <Page pageNumber={this.state.pageNumber}/>
                        </Document>
                        {this.state.file ?
                            <div>
                                <div className="buttonc">
                                    <button
                                        type="button"
                                        disabled={this.state.pageNumber <= 1}
                                        onClick={this.previousPage.bind(this)}
                                        className="Pre"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="button"
                                        disabled={this.state.pageNumber >= this.state.numPages}
                                        onClick={this.nextPage.bind(this)}
                                    >
                                        Next
                                    </button>
                                </div>
                                <p className="text">Page {this.state.pageNumber} of {this.state.numPages}</p>
                            </div>
                            : ""}
                    </div>
                </div>
                <div style={{"borderTop": "1px solid grey", "borderBottom": "1px solid grey"}}>
                    <button style={{"margin": "15px"}}
                            onClick={this.extract.bind(this)}>
                        Extract
                    </button>
                </div>
                {this.state.result.length > 0 ?
                    <div style={{"marginTop": "15px", "paddingBottom": "15px", "borderBottom": "1px solid grey"}}>
                        <p className="text">Result Set</p>
                        <div>
                            <table style={{"margin": "auto"}} className="resultTable">
                                <tbody>
                                <tr>
                                    <th>Name</th>
                                    <th colSpan={this.state.maxSize}>Value</th>
                                </tr>
                                {
                                    this.state.result.map((result, index) => (
                                        <tr key={index}>
                                            <td>{result.name}</td>
                                            {
                                                !Array.isArray(result.value) ?
                                                    <td>{result.value}</td> :
                                                    result.value.map((item, index) => {
                                                        if (index < Math.sqrt(result.value.length)) {
                                                            return  <td key={index}>{item}</td>
                                                        } else {
                                                            return ""
                                                        }
                                                    }
                                                    )
                                            }
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>

                        <button style={{"margin": "15px"}} onClick={this.clear.bind(this)}>Clear</button>
                    </div> : ""}
            </div>
        );
    }
}

export default CertificateUpload;