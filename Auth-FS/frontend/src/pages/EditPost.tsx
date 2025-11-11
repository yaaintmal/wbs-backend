import { getSinglePost, updatePost } from '@/data';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';

type FormData = {
  title: string;
  image: File | null;
  content: string;
};

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [{ title, image, content }, setForm] = useState<FormData>({
    title: '',
    image: null,
    content: '',
  });
   const [loading, setLoading] = useState(false);
   const [fetchLoading, setFetchLoading] = useState(true);
   const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const post = await getSinglePost(id!);
        setForm({ title: post.title, content: post.content, image: null });
      } catch (error: unknown) {
        const message = (error as { message: string }).message;
        toast.error(message);
        navigate('/');
      } finally {
        setFetchLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0] || null;
     setForm((prev) => ({ ...prev, image: file }));
   };

   const performUpdate = async () => {
     try {
       if (!title || !content) {
         throw new Error('Title and content are required');
       }
       setLoading(true);
       const formData = new FormData();
       formData.append('title', title);
       formData.append('content', content);
       if (image) formData.append('image', image);
       await updatePost(id!, formData);
       navigate(`/post/${id}`);
     } catch (error: unknown) {
       const message = (error as { message: string }).message;
       toast.error(message);
     } finally {
       setLoading(false);
     }
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     setShowConfirmModal(true);
   };

  if (fetchLoading) return <div>Loading...</div>;

  return (
    <>
      <form className='md:w-1/2 mx-auto flex flex-col gap-3' onSubmit={handleSubmit}>
      <label className='form-control w-full'>
        <div className='label-text'>Title</div>
        <input
          name='title'
          value={title}
          onChange={handleChange}
          placeholder='A title for your post...'
          className='input input-bordered w-full'
        />
      </label>
      <label className='form-control w-full'>
        <div className='label-text'>Image (optional, upload new to replace)</div>
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='file-input file-input-bordered w-full'
        />
      </label>
      <label className='form-control'>
        <div className='label-text'>Content</div>
        <textarea
          name='content'
          value={content}
          onChange={handleChange}
          className='textarea textarea-bordered h-24'
          placeholder='The content of your post...'
        ></textarea>
      </label>
       <button type='submit' className='btn btn-primary self-center' disabled={loading}>
         Update Post
       </button>
     </form>

     {showConfirmModal && (
       <div className="modal modal-open">
         <div className="modal-box">
           <h3 className="font-bold text-lg">Confirm Update</h3>
           <p className="py-4">Are you sure you want to update this post?</p>
           <div className="modal-action">
             <button className="btn" onClick={() => setShowConfirmModal(false)}>Cancel</button>
             <button className="btn btn-primary" onClick={async () => {
               await performUpdate();
               setShowConfirmModal(false);
             }}>Update</button>
           </div>
         </div>
       </div>
      )}
    </>
  );
};

export default EditPost;