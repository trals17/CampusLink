import { useState } from 'react';
import Input from './input';
import { useFormState } from 'react-dom';
import updateCommentAction from '@/lib/commentActions';

interface IEditCommentProps {
  payload: string;
  commentId: number;
}

export default function EditComment({ payload, commentId }: IEditCommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPayload, setNewPayload] = useState(payload);
  const [state, action] = useFormState(updateCommentAction, null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewPayload(payload); // Revert to original payload
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPayload(e.target.value);
  };

  return (
    <div className="mt-2">
      {!isEditing ? (
        <button
          onClick={handleEditClick}
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          Edit
        </button>
      ) : (
        <form action={action} className="flex flex-col gap-2 mt-2">
          <Input
            name="payload"
            type="text"
            required
            value={newPayload}
            onChange={handleChange}
            className="text-neutral-400 bg-neutral-700 rounded-full text-sm p-2 w-full md:min-w-[500px]"
            errors={state?.fieldErrors?.payload}
          />
          <input name="commentId" value={commentId} type="hidden" />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-orange-600 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
