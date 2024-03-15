import { Editor } from '@tinymce/tinymce-react';

interface HtmlEditorProps {
    handleEditorChange: (content: string) => void;
}

export const HtmlEditor: React.FC<HtmlEditorProps> = ({ handleEditorChange }) => {
    return (
        <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            onEditorChange={handleEditorChange}
            init={{
                plugins: 'autolink charmap emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange formatpainter   permanentpen powerpaste editimage mentions  tableofcontents footnotes mergetags autocorrect typography inlinecss preview fullpage visualchars emoticons nonbreaking textpattern code',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat preview',
                extended_valid_elements: 'svg[viewBox|width|height]'
            }}
            initialValue=""
        />
    );
}
