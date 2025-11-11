import { PostSkeleton } from "@/components";
import { useAuth } from "@/context";
import { deletePost, getSinglePost, updatePost } from "@/data";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const isOwner = user && post && user._id === post.author._id;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: post?.title || "",
    content: post?.content || "",
    image: null as File | null,
  });

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const fetchedPost: Post = await getSinglePost(id);
        setPost(fetchedPost);
      } catch (error: unknown) {
        const message = (error as { message: string }).message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (post) {
      setEditForm({ title: post.title, content: post.content, image: null });
    }
  }, [post]);

  if (loading) return <PostSkeleton />;

  if (!post)
    return <div className="text-center text-xl mt-10">Post not found.</div>;

  return (
    <>
      <article className="w-full max-w-4xl mx-auto my-8 bg-black text-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gray-900 text-white p-6 rounded-t-2xl border-b border-amber-500">
          <div className="text-center w-full">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-amber-200 via-amber-600 to-amber-300 p-2">
              {post.title}
            </h1>
          </div>
        </div>

        {post.image && (
          <figure className="p-4">
            <img
              src={post.image}
              alt={post.title}
              className="rounded-xl w-full object-cover max-h-96 shadow-2xl border border-amber-500/50"
            />
          </figure>
        )}

        <div className="p-6 md:p-8">
          <p className="text-lg text-gray-200 leading-8 text-left">
            {post.content}
          </p>
        </div>

        {isOwner && (
          <div className="p-6 bg-gray-900 border-t border-amber-500 flex justify-end gap-4">
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200"
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </button>
            <button
              className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
          </div>
        )}
      </article>

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
                    await deletePost(post!._id);
                    navigate("/");
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
                    await updatePost(post!._id, formData);
                    const updatedPost = await getSinglePost(post!._id);
                    setPost(updatedPost);
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

export default Post;
