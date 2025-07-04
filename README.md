# Bob

Bob is your CLI buddy aimed to help you with your needs. Bob can remember and execute custom actions as well as do some of them on the fly through commands.

Content passed to actions to be learnt can be passed through stdin or as positional parameters.

## ℹ️ About

Bob was created as a mean to save repetitive stuff that is used in the terminal as well as provide helpful and quick to use features.

## ✨ Features

- 🧠 **Learn Actions**: Teach Bob new actions with custom content
- 🚀 **Execute Actions**: Run previously learnt actions
- 📝 **Multiple Action Content Types**: Support for plain text, files, directories, scripts, and more
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

## 🗂️ Storage

Bob stores all learnt actions in a `learntActions.json` file under `data/`.
