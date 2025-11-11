import { createPost } from "@/data";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

type FormData = {
  title: string;
  image: File | null;
  content: string;
};

const CreatePost = () => {
  const navigate = useNavigate();
  const [{ title, image, content }, setForm] = useState<FormData>({
    title: "",
    image: null,
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!title || !image || !content) {
        throw new Error("All fields are required");
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", image);
      const newPost: Post = await createPost(formData);
      setForm({ title: "", image: null, content: "" });
      navigate(`/post/${newPost._id}`);
    } catch (error: unknown) {
      const message = (error as { message: string }).message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="md:w-1/2 mx-auto flex flex-col gap-3 p-2 mt-4"
      onSubmit={handleSubmit}
    >
      <label className="form-control w-full">
        <div className="label-text">Title</div>
        <input
          name="title"
          value={title}
          onChange={handleChange}
          placeholder="A title for your post..."
          className="input input-bordered w-full"
        />
      </label>
      <label className="form-control w-full">
        <div className="label-text">Image</div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full"
        />
      </label>
      <label className="form-control">
        <div className="label-text">Content</div>
        <textarea
          name="content"
          value={content}
          onChange={handleChange}
          className="textarea textarea-bordered h-24"
          placeholder="The content of your post..."
        ></textarea>
      </label>
      <button
        type="submit"
        className="btn btn-primary self-center"
        disabled={loading}
      >
        Create Post
      </button>
    </form>
  );
};

export default CreatePost;
