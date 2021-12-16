import React, { Component } from "react";
import "./styles.css";
import { Posts } from "../../components/Posts";
import { loadPosts } from "../../utils/load-post";
import { Button } from "../Button";
import { TextInput } from "../../components/TextInput";

export class Home extends Component {
  state = {
    posts: [],
    allPost: [],
    page: 0,
    postsPerPage: 10,
    searchValue: "",
  };
  async componentDidMount() {
    await this.loadPosts();
  }
  loadPosts = async () => {
    const { page, postsPerPage } = this.state;
    const postAndPhotos = await loadPosts();
    this.setState({
      posts: postAndPhotos.slice(page, postsPerPage),
      allPost: postAndPhotos,
    });
  };

  loadMorePost = () => {
    const { page, postsPerPage, allPost, posts } = this.state;
    const nextPage = page + postsPerPage;
    const nextPost = allPost.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPost);

    this.setState({ posts, page: nextPage });
  };

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  };

  render() {
    const { posts, page, postsPerPage, allPost, searchValue } = this.state;
    const noMorePosts = page + postsPerPage >= allPost.length;

    const filteredPost = !!searchValue
      ? allPost.filter((post) => {
          return post.title.toLowerCase().includes(searchValue.toLowerCase());
        })
      : posts;
    return (
      <section className="container">
        <div className="search-container">
          {!!searchValue && <h1>Serach value : {searchValue}</h1>}

          <TextInput
            handleChange={this.handleChange}
            searchValue={this.searchValue}
          />
        </div>

        {filteredPost.length > 0 ? (
          <Posts posts={filteredPost} />
        ) : (
          <p>Não há Posts</p>
        )}

        <div className="button-container">
          {!searchValue && (
            <Button
              text={"load more posts"}
              onClick={this.loadMorePost}
              disabled={noMorePosts}
            />
          )}
        </div>
      </section>
    );
  }
}
