import React from "react";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';


class DragDrop extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            drag: false
        };
    }

    dropRef = React.createRef()

    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({drag: true})
        }
    }
    handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--;
        if (this.dragCounter === 0) {
            this.setState({drag: false})
        }
    }
    handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({drag: false})
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.props.handleDrop(e.dataTransfer.files)
            e.dataTransfer.clearData()
            this.dragCounter = 0
        }
    }

    componentDidMount() {
        let div = this.dropRef.current
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
    }

    componentWillUnmount() {
        let div = this.dropRef.current
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }

    render() {
        return (
            <div
                style={{display: 'inline-block', position: 'relative'}}
                ref={this.dropRef}
            >
                {this.state.drag &&
                    <div
                        style={{
                            border: '2px dashed red',
                            backgroundColor: '#D30803',
                            backgroundImage: "linear-gradient(180deg, #D30803 0%, #FEB2B0 74%)",
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 9999,
                            borderRadius: "10px"
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '40%',
                                right: 0,
                                left: 0,
                                textAlign: 'center',
                                fontSize: '25px',
                                color: 'red'
                            }}
                        >
                            <div>Drop Here</div>
                        </div>
                    </div>
                }
                {this.props.children}
            </div>
        );
    }
}

export default DragDrop;