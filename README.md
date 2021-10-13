# 简单的HTMLparser和AST还原到HTML

## [在线体验](https://blog.heyliubo.top/simple-htmlparser/)

## AST
```
{
    "type": "root",
    "children": [
        {
            "type": "node",
            "tag": "div",
            "children": [
                {
                    "type": "text",
                    "content": "\n    "
                },
                {
                    "type": "node",
                    "tag": "span",
                    "children": [
                        {
                            "type": "text",
                            "content": "\n        "
                        },
                        {
                            "type": "node",
                            "tag": "a",
                            "children": [
                                {
                                    "type": "text",
                                    "content": "点击"
                                }
                            ],
                            "attrs": [
                                {
                                    "href": "/name"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "content": "\n    "
                        }
                    ],
                    "attrs": [
                        {
                            "id": "inner"
                        }
                    ]
                },
                {
                    "type": "text",
                    "content": "\n    "
                },
                {
                    "type": "node",
                    "tag": "span",
                    "children": [
                        {
                            "type": "text",
                            "content": "\n        "
                        },
                        {
                            "type": "node",
                            "tag": "a",
                            "children": [
                                {
                                    "type": "text",
                                    "content": "点击"
                                }
                            ],
                            "attrs": [
                                {
                                    "href": "/name"
                                }
                            ]
                        },
                        {
                            "type": "text",
                            "content": "\n    "
                        }
                    ],
                    "attrs": [
                        {
                            "id": "inner"
                        }
                    ]
                },
                {
                    "type": "text",
                    "content": "\n"
                }
            ],
            "attrs": [
                {
                    "class": "out"
                }
            ]
        },
        {
            "type": "text",
            "content": "\n this is a HTML"
        }
    ]
}
```
## 还原
```
<div class="out">
    <span id="inner">
        <a href="/name">点击</a>
    </span>
    <span id="inner">
        <a href="/name">点击</a>
    </span>
</div>
 this is a HTML
```
