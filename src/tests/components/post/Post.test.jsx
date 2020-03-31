import React from "react";
import { shallow } from "enzyme";
import Post from "../../../components/post/Post";
import demoImage from "../../../images/demo-img.png";

const post = {
  id: "1",
  username: "username",
  authorId: "authorId",
  userId: "userId",
  published: (new Date()).toISOString(),
  content: "content",
  comments: [{
    id: "95c76f63-5579-45f6-810f-e0665f2ea588",
    comment: "Sample Comment",
    published: "2020-03-12T23:41:35.339192Z",
    contentType: "text/plain",
    author: { id: "commentAuthorId", displayName: "commentAuthor" },
  }],
};

describe("Post Block Components", () => {
  it("should render correctly", () => {
    const component = shallow(
      <Post
        post={post}
      />,
    );
    expect(component).toMatchSnapshot();
  });

  it("should render markdown content correctly", () => {
    const mdContent = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

1. Bullet 1
2. Bullet 2

[Google Link](https://www.google.com)

![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Some logo")

Inline \`code\` 

\`\`\`
var s = "some code";
alert(s);
\`\`\`

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

> Blockquote

---

Normal Text
    `;
    post.content = mdContent;
    const component = shallow(
      <Post
        post={post}
      />,
    );
    expect(component).toMatchSnapshot();
  });
});
