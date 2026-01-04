import { dropHandler } from './eventHandlers/drop-event-handler';
import { uploadFileEventHandler} from './eventHandlers/upload-file-event-handler';

document.body.addEventListener('change', uploadFileEventHandler, true);
window.addEventListener("drop", dropHandler, true);
