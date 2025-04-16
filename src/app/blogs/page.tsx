"use client";

import Image from "next/image";
import Link from "next/link";

const BlogPage = () => {
  const posts = [
    {
      title: "Bài viết 1",
      slug: "bai-viet-1",
      year: 2025,
      month: "03",
      day: "19",
    },
    {
      title: "Bài viết 2",
      slug: "bai-viet-2",
      year: 2025,
      month: "03",
      day: "18",
    },
  ];
  return (
    <section>
      <div className="blogs-1">
        <div className="container mb-4 p-3">
          <div className="row mt-3">
            <div className="col-md-12 text-center about-us-1">
              <div className="overlay">
                <h1 className="text-white mb-4">Blogs</h1>
                <p className="text-white opacity-75">
                  Welcome to our blog! Stay tuned for the latest articles, news,
                  and insights about books and reading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mx-2 my-4">
        <div className="row d-flex">
          <div className="col-md-7">
            <h2>
              Discovering the Magic of Storytelling: A Review of “A Long Walk to
              Freedom"
            </h2>
            <p>
              Every reader knows that some books stay with you long after you
              turn the last page. "A Long Walk to Freedom" by Nelson Mandela is
              one such book—a powerful memoir that not only delves into the life
              of one of the world’s most iconic leaders but also captures the
              unyielding spirit of resilience and hope.
            </p>
            <button className="btn bg-warning text-dark">Read more</button>
            <div>
              <Image
                src="/assets/app/images/na8.jpeg"
                alt="Blog Image"
                width={100}
                height={100}
              />
              <span className="text-muted">Posted on 12/12/2021</span>
              <span className="text-muted">By Admin</span>
            </div>
          </div>
          <div className="col-md-5">
            <Image
              src="/assets/app/images/Blog-1.jpg"
              alt="Blog Cover"
              width={300}
              height={200}
            />
          </div>
        </div>
      </div>
      <div className="container-fluid d-flex flex-column flex-md-row">
        <div className="col-md-4 px-3 post-cate-top">
          <div className="mb-5">
            <h2>Categories</h2>
            <ul>
              <li>Book Reviews</li>
              <li>Book Recommendations</li>
              <li>Author Interviews</li>
              <li>Book News</li>
              <li>Book Releases</li>
              <li>Reading Challenges</li>
              <li>Book Clubs</li>
            </ul>
          </div>
        </div>
        <div className="col-md-8 px-5 ">
          <div className="row">
            {posts.map((post, index) => (
              <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <Link
                  href={`/blogs/${post.year}/${post.month}/${post.day}/${post.slug}`}
                  className="post-card"
                >
                  <div className="post-card-image">
                    <Image
                      src="/assets/app/images/Blog-1.jpg"
                      alt={`Topic Image ${index + 1}`}
                      width={300}
                      height={200}
                    />
                  </div>
                  <div className="post-card-content">
                    <span className="post-card-category">
                      <span className="fw-bold">Category {index + 1}</span> |{" "}
                      {post.day}/{post.month}/{post.year}
                    </span>
                    <h6 className="post-card-title">{post.title}</h6>
                    <p className="post-card-description">
                      This is a sample description for {post.title}.
                    </p>
                  </div>
                </Link>
              </div>
            ))}

            {[...Array(6)].map((_, index) => (
              <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <Link className="post-card" href={""}>
                  <div className="post-card-image">
                    <Image
                      src="/assets/app/images/Blog-1.jpg"
                      alt={`Topic Image ${index + 1}`}
                      width={300}
                      height={200}
                    />
                  </div>
                  <div className="post-card-content">
                    <span className="post-card-category">
                      <span className="fw-bold">Category {index + 1}</span> |
                      01/01/2023
                    </span>
                    <h6 className="post-card-title">
                      Sample Blog Post {index + 1}
                    </h6>
                    <p className="post-card-description">
                      This is a sample description for blog post {index + 1}.
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center mt-4">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <Link className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="#">
                      1
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="#">
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="#">
                      3
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPage;
