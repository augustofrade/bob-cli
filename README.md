# Bob

> Check out [Stuart SSG](https://github.com/augustofrade/stuart-ssg), Bob's companion!

Bob is your CLI buddy aimed to help you with your needs. Bob can remember and execute custom actions as well as do some of them on the fly through commands.

Content passed to actions to be learnt can be passed through stdin or as positional parameters.

Bob was made to be quick and easy to use, as well as a familiar and a relaxed experience.
That's why I named it Bob and didn't follow a standardized command naming approach, such as `bob <command> <subcommand>` (e.g.: `bob actions add`),
for its core commands, and used common day-to-day english verbs instead, namely `forget` and `do`. In the end, it feels as if the user is asking a friend to do something to help them: `bob do open_teddies_folder`.

Bob can do much more, check the Features section below!

## ℹ️ About

Bob was created as a mean to save repetitive stuff that is used in the terminal as well as provide helpful and quick to use features.

## ✨ Features

- 🧠 **Learn Actions**: Teach Bob new actions with custom content
- 🚀 **Execute Actions**: Run previously learnt actions
- 📝 **Multiple Action Content Types**: Support for plain text, files, directories, scripts, and more
- 🌐 **HTTP Server with hot reload**: Serve static content in a local HTTP server with hot reload
- 💽 **CSS Minification**: Minify and optionally bundle CSS files
- 📱 **QR Code Generation**: Create QR codes on the fly for content passed as positional argument or through stdin
- 🔍 **Regex Testing**: Test regex patterns
- 💾 **Persistent Storage**: Bob remembers everything you teach him

## 🛠️ Installation

### Simple setup

To install Bob just clone the repository and run the setup command, it's as simple as that:

```bash
git clone https://github.com/augustofrade/bob-cli
cd bob-cli
npm run setup
```

### Step-by-step installation

If you prefer to know exactly what you're doing:

```bash
git clone https://github.com/augustofrade/bob-cli
cd bob-cli
npm i
npm run build
npm install -g bob-cli
```

### Check the installation

Run the following command to greet Bob and check if the installation succeeded:

```bash
bob hello
```

## Example Usage

In the following example Bob learns and executes an action:

```bash
$ bob learn say_hi "Hello, Bob!"
$ bob do say_hi

Hello, Bob!
```

## 📚 Commands

### 🎓 Learn Command

Teach Bob something new to remember and execute another time.

```bash
bob learn <action_name> <content> [options]
```

**Options:**

- `--type <type>`: Type of content (default: "text")
  - `text`: Plain text content
  - `file`: File path\*
  - `dir`: Directory path\*
  - `list-dir`: Directory listing\*
  - `script`: Executable script\*
  - `qr`: content that will be encoded to QR Code
- `--force, -f`: Tells bob to update its knowledge of the provided action

\* Relative paths will be converted to absolute paths.

**Examples:**

```bash
# Learn a simple text action
bob learn say_hello "Hello, World!"

# Learn a path. Example result path: `/home/\<user\>/Documents/teddies
bob learn teddies_folder ./teddies
```

### 🎯 Do Command

Execute a previously learnt action.

```bash
bob do <action_name>
```

**Examples:**

```bash
# Execute the provided "say_hello" action
bob do say_hello

#Provide no action name to list all learnt actions
bob do
```

### 🗑️ Forget Command

Remove a previously learnt action from Bob's memory.

```bash
bob forget <action_name>
```

**Examples:**

```bash
# Forget the "say_hello" action
bob forget say_hello
```

### 🧹 Clear Command

Clear Bob's entire memory, removing all learnt actions.

```bash
bob clear
```

### 🌐 Serve Command

Start a local HTTP server and serve the contents of the specified directory.

When the server starts, it automatically opens a browser tab with the server URL.

```bash
bob serve [directory] [options]
```

**Options:**

- `--port, -p <number>`: Port to run the server on (default: 3000)
- `--watch, -w`: Watch the directory Bob is serving for hot reloading (default: true)
- `--open, -o`: Opens the served directory in the default web browser (default: true)
- `--log-level, -l <level>`: Sets the log level for server output (choices: "info", "debug", "verbose", default: "info")

**Examples:**

```bash
# Serve the current directory on default port (3000) in watch mode
bob serve

# Serve a specific directory on custom port without watching the directory contents
bob serve ~/Documents/portfolio -p 8080 --watch false
```

**Logging Output Example:**

```bash
$ bob serve --log-level "debug"

Serving directory /home/user/Documents/portfolio/
Server is running at http://localhost:3000

[INFO]     Incoming request URL: /
[DEBUG]    Resolved file path: /home/user/Documents/portfolio/index.html

[INFO]     Incoming request URL: /styles.css
[DEBUG]    Resolved file path: /home/user/Documents/portfolio/styles.css

[INFO]     Incoming request URL: /assets/dog.jpg
[DEBUG]    Resolved file path: /home/user/Documents/portfolio/assets/dog.jpg
```

### 💽 Minify Command

Minify `*.css` files into their `*.min.css` counterparts or bundle them all together into a single file.

Multiple file and directory paths can be passed to the minification process and will be processed **in the order they are passed**.
If your CSS has to be loaded from the client in a specific order, consider passing the path to each file of the source directory in the desired order.

If no output is specified, the minified content will be saved in the current working directory.

```bash
bob minify [files...] [options]
```

**Options:**

- `--output, -o <string>`: Output directory of the minified files; if `--singlefile` used, it is the output **file**.
- `--singlefile, -o`: Bundles all minified content into a single file. The default output file is `styles.min.css` if `--output`is not used.

**Examples:**

```bash
# Minifies all files of the current directory. Output in the same directory
bob minify

# Minifies all files of the passed directory. Output in the current directory
bob minify styles

# Minifies all files into an output directory
bob minify styles -o dist

# Minifies multiple files from different directories into a single file
bob minify styles dir1/style1.css dir2/style2.css --output site.min.css --singlefile
```

**Input and output:**

```css

/* INPUT */
body {
  user-drag: none;
  /*

  first comment

  */
  user-select: none;
  /*
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  margin: 0;
*/
}

#container {
  width: 100vw;
  ...
}

/* OUTPUT */
body{user-drag:none}#container{width:100vw;...}

```

### 🌳 Tree Command

Display a tree structure of the specified directory with customizable depth and formatting.

```bash
bob tree [directory] [options]
```

**Options:**

- `--depth, -d <number>`: Depth of the tree structure to display (default: 3)
- `--identation-size, -i <number>`: Size in spaces of the displayed indentation (default: 2)
- `--identation-char, -c <char>`: Character used to display the indentation (default: "-")
- `--show-hidden, -h`: Show hidden files and directories
- `--show-files, -f`: Show files in the tree structure (default: true)
- `--full-path, -p`: Show full path of files and directories. With this flag, Bob ignore the indentation size and character options.

**Examples:**

```bash
# Display tree of current directory with default options
bob tree

# Display directory tree structure
# - without an indentation character,
# - indentation of 4 spaces
# - showing hidden files
bob tree ./project -h -i 4 -c " "

# Show only directories without displaying the files
bob tree ./src --show-files false

# Display full paths
bob tree ./project -p
```

### 📱 QR Code Command

Encode the provided text content.

```bash
bob qr <content>
```

**Options:**

- `--output, -o <file>`: Save QR code to a specific file

**Examples:**

```bash
# Encode the text content provided as a positional parameter and print it on the terminal
bob qr https://www.youtube.com/watch?v=dQw4w9WgXcQ


# Encode the text content provided as a positional parameter and save it to an output file
bob qr https://www.youtube.com/watch?v=dQw4w9WgXcQ -o qr.svg


# Encode the text content provided through stdin
echo "https://www.youtube.com/watch?v=dQw4w9WgXcQ" | bob qr
```

### 🔍 Regex Command

Test regex patterns against text with feedback.

```bash
bob regex <pattern> [text] [options]
```

**Options:**

- `--flags, -f <flags>`: Regex flags (e.g., 'g' for global, 'i' for case-insensitive)
- `--all, -a`: Return complete regex result instead of just the matches

**Examples:**

```bash
# Test regex pattern with text
bob regex "(\w+)" "Hello Bob!"

# Test with flags
bob regex "Hello ([a-z]+)!" "Hello Bob!" -f i

# Get full regex result
bob regex "\w+" "test string" --all

# Read from stdin (if content not provided)
echo "Bob with stdin" | bob regex "(\w+)"
```

### 👋 Hello Command

Get a friendly greeting from Bob.

```bash
bob hello
```

### 📋 List Actions (Default Command)

View all learnt actions. This is also the default command when no command is provided.

```bash
bob tellme

# or

bob
```

## 🎯 Use Cases

### 🖹 Save text content as an action

```bash
# Get content from stdin
cat file.txt | bob learn out_values

# Use it elsewhere
bob do out_values
```

### 📁 File & Directory Management

```bash
# Remember important paths
bob learn projects_dir ~/Development/projects --type dir
bob learn config_file ~/.config/app/config.json --type file

# Use them later
bob do projects_dir  # /home/<user>/Development/projects
cd $(bob do config_file)   # /home/<user/app/config.json
```

### 🔧 Custom Scripts & Commands

```bash
# Learn complex scripts
bob learn deploy "git push && ssh server 'cd app && git pull && npm install && pm2 restart app'" --type script

# Learn frequently used commands
bob learn docker_clean "docker system prune -a" --type script

# Execute when needed
bob do deploy
bob do docker_clean
```

### 🌐 Local Development Server

```bash
# Serve a static website with full debug logging
bob serve ./website -l debug
```

### 💽 Minify Command

```bash

# Minifies multiple files and directories into a single file
bob minify styles ../single.css --output site.min.css --singlefile
```

### 🌳 Project Structure Exploration

```bash
# Explore project structure with custom depth
bob tree ./src -d 5

# Display directory tree structure
# - without an indentation character,
# - indentation of 4 spaces
# - showing hidden files
bob tree ./project -h -i 4 -c " "
```

## 🗂️ Storage

Bob stores all learnt actions in a `learntActions.json` file under `data/`.
