import styles from './BlogPost.module.css';
import Image from 'next/image';

const BlogPost = ({ params }: { params: { year: string; month: string; day: string; slug: string } }) => {
  const samplePost = {
    title: "Khám phá thế giới sách",
    author: "Admin",
    content: `
      Sách không chỉ là kho tàng kiến thức mà còn là cánh cửa mở ra những thế giới vô tận. 
      Đọc sách giúp bạn nâng cao tư duy, mở rộng tầm nhìn và khám phá những điều mới mẻ.
      Hãy cùng chúng tôi tìm hiểu về những cuốn sách hay nhất năm nay!
    `,
    coverImage: "/assets/app/images/Blog-1.jpg",
    date: `${params.day}/${params.month}/${params.year}`
  };

  return (
    <div className={styles.blogContainer}>
      <div className={styles.blogHeader}>
        <h1 className={styles.blogTitle}>{samplePost.title}</h1>
        <p className={styles.blogMeta}>
          Ngày đăng: {samplePost.date} | Tác giả: {samplePost.author}
        </p>
      </div>

      <div className={styles.blogImage}>
        <Image src={samplePost.coverImage} alt="Blog Cover" width={800} height={400} />
      </div>

      <div className={styles.blogContent}>
        <p>{samplePost.content}</p>
      </div>
    </div>
  );
};

export default BlogPost;
