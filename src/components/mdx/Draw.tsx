import {Tldraw} from 'tldraw'
import 'tldraw/tldraw.css'



const Draw = ({shapes}) => {
 
  const handleMount = (editor) => {
    editor.createShapes(shapes)
    editor.selectAll()
    editor.zoomToSelection({
      animation: {duration: 5000}
    })
  }
  return (
      <Tldraw hideUi onMount={handleMount} />
  )
}

export default Draw