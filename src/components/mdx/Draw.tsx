import { Tldraw, type Editor } from 'tldraw'
import 'tldraw/tldraw.css'

const Draw = ({ shapes }) => {
	const handleMount = (editor: Editor) => {
		editor.createShapes(shapes)
		editor.selectAll()
		editor.zoomToSelection({
			animation: { duration: 5000 }
		})
	}
	return <Tldraw hideUi onMount={handleMount} />
}

export default Draw
