# Graph Visualizer 🗺️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A lightweight, browser-based graph visualizer designed to help students and developers visualize graphs and practice graph algorithms. Perfect for algorithm studies and note-taking in tools like Obsidian.

![Graph Visualization Example](./screenshots/example.png)

## ✨ Features

- **Simple Input Format**: Input graphs using the format `A-B 2` (Node1-Node2 Weight)
- **Export Options**: Save graph as PNG for your notes or presentations
- **No Dependencies**: Pure HTML, CSS, and JavaScript - runs directly in your browser
- **Responsive Design**: Works on both desktop and mobile devices

## 🚀 Motivation

When I was studying algorithms and data structures as a course in university, I often found myself needing to visualize graphs from my studies. When practicing with AI tools like ChatGPT, I'd receive graph definitions in formats like `A-B 2` (representing an edge between node A and B with weight 2), but had to draw them manually to visualize them properly.

This tool was born out of that need - a simple, no-frills way to quickly visualize graphs without leaving the browser.

## 🖥️ Usage
**recommended method**
go to https://tomcegraphics.github.io/graph-visualizer/
and thats it

**offline method**
1. Clone this repository or download the files
2. Open `index.html` in your preferred web browser
3. Enter your graph in the input box using the format: `A-B 2` (one edge per line)
4. Click "Visualize" to generate the graph
5. Drag nodes to rearrange the layout as needed
6. Use the "Save as PNG" button to export the graph for your notes

### Example Input
```
A-B 5
A-C 3
B-D 2
C-D 1
D-E 4
```

## 📸 Examples in Obsidian

### Graph Visualization
![Graph in Obsidian](./screenshots/obsidian-example.png)

### With Algorithm Notes
![Graph with Notes](./screenshots/obsidian-notes.png)

## 🛠️ Development

This is a simple, self-contained project with no build step required. The entire application consists of:

- `index.html` - The main HTML file
- `style.css` - Basic styling
- `script.js` - The graph visualization logic

To contribute or modify:
1. Fork the repository
2. Make your changes
3. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [D3.js](https://d3js.org/) for graph visualization
- Inspired by countless algorithm study sessions
- Special thanks to the open source community for amazing tools and resources
