import { useAuth } from "@/context";
import { deletePost, updatePost } from "@/data";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";

type PostCardProps = {
  _id: string;
  content: string;
  image: string;
  title: string;
  author: {
    _id: string;
    firstName: string;
  };
  onUpdate: () => void;
};

const PostCard = ({
  _id,
  content,
  image,
  title,
  author,
  onUpdate,
}: PostCardProps) => {
  const { user } = useAuth();
  const isOwner = user && user._id === author._id;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title,
    content,
    image: null as File | null,
  });

  useEffect(() => {
    setEditForm({ title, content, image: null });
  }, [title, content]);

  return (
    <>
      <div className="card bg-base-100 shadow-xl">
        {image && (
          <figure className="bg-primary h-48">
            <img
              src={image}
              alt={title}
              className="object-cover h-full w-full"
            />
          </figure>
        )}
        <div className="card-body">
          <h2 className="card-title bg-clip-text text-transparent bg-linear-to-r from-amber-200 via-amber-600 to-amber-300">
            {title}
          </h2>
          <p className="truncate text-wrap">{content}</p>
          <p className="text-sm text-gray-600">By {author.firstName}</p>
          <Link to={`/post/${_id}`} className="btn btn-primary mt-4">
            Read More
          </Link>
          {isOwner && (
            <div className="flex gap-2 mt-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditModal(true)}
              >
                Edit
              </button>
              <button
                className="btn btn-error"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">Are you sure you want to delete this post?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={async () => {
                  try {
                    await deletePost(_id);
                    onUpdate();
                    setShowDeleteModal(false);
                    toast.success("Post deleted");
                  } catch (error) {
                    toast.error((error as Error).message);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Post</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowEditConfirmModal(true);
              }}
            >
              <label className="form-control w-full">
                <div className="label-text">Title</div>
                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="input input-bordered w-full"
                />
              </label>
              <label className="form-control w-full">
                <div className="label-text">Image (optional)</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      image: e.target.files?.[0] || null,
                    }))
                  }
                  className="file-input file-input-bordered w-full"
                />
              </label>
              <label className="form-control">
                <div className="label-text">Content</div>
                <textarea
                  value={editForm.content}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="textarea textarea-bordered h-24"
                />
              </label>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditConfirmModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Update</h3>
            <p className="py-4">Are you sure you want to update this post?</p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowEditConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    const formData = new FormData();
                    formData.append("title", editForm.title);
                    formData.append("content", editForm.content);
                    if (editForm.image)
                      formData.append("image", editForm.image);
                    await updatePost(_id, formData);
                    onUpdate();
                    setShowEditModal(false);
                    setShowEditConfirmModal(false);
                    toast.success("Post updated");
                  } catch (error) {
                    toast.error((error as Error).message);
                  }
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default PostCard;
