# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH
export PATH="/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin"
PATH="$HOME/.local/bin${PATH:+:${PATH}}"
export KUNST_MUSIC_DIR="/home/inibras/Music/"
###export PATH="${PATH}:${HOME}/.local/bin/"
#export PATH=$PATH:~/.bin
export FZF_BASE="$HOME/.oh-my-zsh/plugins/fzf"
MICRO_TRUECOLOR=1
export TERM="xterm-256color"
#TERM=urxvt-256color
# Path to your oh-my-zsh installation.
export ZSH="~/.oh-my-zsh/"
plugins=(
git
virtualenv
pyenv
python
zsh-syntax-highlighting
zsh-completions
fzf
)
autoload -Uz bracketed-paste-magic
zle -N bracketed-paste bracketed-paste-magic
autoload -Uz url-quote-magic
zle -N self-insert url-quote-magic
source "$HOME/.oh-my-zsh/plugins/virtualenv/virtualenv.plugin.zsh"
autoload -U compinit && compinit
source ~/.oh-my-zsh/custom/themes/powerlevel9k/powerlevel9k.zsh-theme
source ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh

POWERLEVEL9K_CONTEXT_DEFAULT_BACKGROUND='5'
POWERLEVEL9K_CONTEXT_DEFAULT_FOREGROUND='0'
POWERLEVEL9K_STATUS_OK_BACKGROUND='8'
POWERLEVEL9K_VCS_CLEAN_BACKGROUND='11'
POWERLEVEL9K_VCS_UNTRACKED_BACKGROUND='8'
POWERLEVEL9K_VCS_MODIFIED_BACKGROUND='10'
POWERLEVEL9K_VCS_MAX_SYNC_LATENCY_SECONDS='0.05'
POWERLEVEL9K_VI_INSERT_MODE_STRING='INSERT' 
POWERLEVEL9K_VI_COMMAND_MODE_STRING='NORMAL'﻿
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=()
ZLE_RPROMPT_INDENT=0

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
#ZSH_THEME="powerlevel9k/powerlevel9k"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random wpill cause zsh to load
# a theme from this variable instead of looking in ~/.oh-my-zsh/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS=true

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in ~/.oh-my-zsh/plugins/*
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git)

#source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='nano'
# else
#   export EDITOR='nano'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
# History
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=$HOME/.zsh_history
setopt histignorealldups sharehistory
#
source $HOME/.fzf/key-bindings.zsh
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
# fzf settings
export FZF_CTRL_T_COMMAND='find .'

if [ -f ~/.aliases ]; then
    . ~/.aliases
fi

#[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
# save path on cd
# ░▀█▀░█▀▀░█▀▄░█▄█░▀█▀░█▀█░█▀█░█░░░░░█▀▀░█▄█░█░█░█░░░█▀█░▀█▀░█▀█░█▀▄
# ░░█░░█▀▀░█▀▄░█░█░░█░░█░█░█▀█░█░░░░░█▀▀░█░█░█░█░█░░░█▀█░░█░░█░█░█▀▄
# ░░▀░░▀▀▀░▀░▀░▀░▀░▀▀▀░▀░▀░▀░▀░▀▀▀░░░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀░▀░░▀░░▀▀▀░▀░▀

# Get Terminal Emulator
TERM_EMULATOR=$(ps -h -o comm -p $PPID)

# ░█▀█░█▀▀░█▀█░█▀▀░█▀▀░▀█▀░█▀▀░█░█
# ░█░█░█▀▀░█░█░█▀▀░█▀▀░░█░░█░░░█▀█
# ░▀░▀░▀▀▀░▀▀▀░▀░░░▀▀▀░░▀░░▀▀▀░▀░▀

if [[ "$TERM_EMULATOR" == *"kitty"* ]];
then
	# kitty
	neofetch --backend 'kitty'
elif [[  "$TERM_EMULATOR" == *"tmux"*  ]] || [[ "$TERM_EMULATOR" == "login" ]];
	then
	# tmux
	neofetch --backend 'w3m' --ascii_distro 'arch_small' 
else
	# xterm and rxvt
	neofetch --backend 'w3m' --xoffset 13 --yoffset 13 --gap 2
fi
# GPG Dialog
export GPG_TTY="$(tty)"
#sh ~/.scripts/walpy.sh
# --ascii_distro debian