import { FaFile } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";


interface MessagesFileUploadProps {
    uploadedFiles: File[];
    removeFile: (index: number) => void;
}

const MessagesFileUpload = ({uploadedFiles, removeFile}: MessagesFileUploadProps) => {
    return ( 
        <div>
                {uploadedFiles.length > 0 && (
                            <div className="files-container" style={{marginTop:'1rem', marginBottom: '1.5rem', justifyContent: 'flex-start', gap: '0.7rem', fontSize: '14px'}}>
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="file-container">
                                        <FaFile className="app-icon"/>
                                        <p>{file.name.length > 15 ? `${file.name.slice(0, 12)}...` : file.name}</p>
                                        <button className="file-remove-btn" onClick={() => removeFile(index)}><RiDeleteBin6Fill style={{fontSize: '20px'}}/></button>
                                    </div>
                                ))}
                            </div>
                )}
            </div>
    )
}

export default MessagesFileUpload