import { ITagsList } from "@/models/api/event-api";
import { Editor } from "@tinymce/tinymce-react";

interface HtmlEditorProps {
    handleEditorChange?: (content: string) => void;
    value?: string;
    tagsList?: ITagsList[];
}

export const HtmlEditor: React.FC<HtmlEditorProps> = ({ handleEditorChange, value = "", tagsList = [] }) => {
    return (
        <Editor
            tinymceScriptSrc={'/third-party/tinymce/tinymce.min.js'}
            onEditorChange={handleEditorChange}
            init={{
                plugins:
                    "autolink charmap emoticons image link lists media searchreplace table visualblocks wordcount checklist  mergetags preview visualchars emoticons nonbreaking code",
                toolbar:
                    "mergetags | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table  | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat preview",
                extended_valid_elements: "svg[viewBox|width|height]",
                mergetags_prefix: "{{",
                mergetags_suffix: "}}",
                mergetags_list: tagsList,
            }}
            value={value}
        />
    );
};
