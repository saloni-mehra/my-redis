# MyRedis

A simplified Redis-like in-memory key-value database built from scratch.


“Implemented RESP-based client-server communication with RESP request parsing and response formatting.”

# 🚀 Build Your Own Redis

A lightweight **Redis-inspired in-memory database server built from scratch using Node.js**.

This project was created as part of a **Build Your Own Redis Hackathon** to understand how a Redis-like database works internally — from TCP networking and command processing to in-memory data structures, key expiration, persistence, Pub/Sub messaging, and client-server communication.

The goal was not to use Redis itself, but to **build the core functionality ourselves**.

---

## 📌 Project Overview

Redis is a high-performance in-memory data store that communicates with clients over a network protocol and provides multiple data structures, expiration, persistence, and Pub/Sub messaging.

In this project, a simplified Redis-like server was implemented from the ground up using **Node.js TCP sockets**.

```text
                    ┌──────────────────────┐
                    │    Interactive CLI   │
                    │    client/client.js   │
                    └──────────┬───────────┘
                               │
                               │ TCP
                               ▼
                    ┌──────────────────────┐
                    │      Redis Server    │
                    │     src/server.js    │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼─────────────────┐
              │                │                 │
              ▼                ▼                 ▼
       ┌────────────┐   ┌────────────┐   ┌──────────────┐
       │  Commands  │   │ In-Memory  │   │ Persistence  │
       │            │   │   Store    │   │              │
       └────────────┘   └────────────┘   └──────┬───────┘
              │                                  │
              ▼                                  ▼
       ┌────────────┐                     ┌──────────────┐
       │  Pub/Sub   │                     │ data/dump.json│
       │   Manager  │                     └──────────────┘
       └────────────┘
```

---

# ✨ Features

## 🔌 Core Database

* Custom TCP server built using Node.js
* Multiple client connections
* In-memory key-value storage
* Command parsing and execution
* Redis-style command responses
* Interactive CLI client
* Error handling for invalid commands and operations

---

## 🔑 Key Operations

* `SET`
* `GET`
* `DEL`
* `EXISTS`
* `KEYS`
* `FLUSHALL`

These commands provide the basic key-value database functionality.

---

## ⏳ Key Expiration

The server supports automatic key expiration.

* `EXPIRE`
* `TTL`
* `PERSIST`
* Real key expiration
* Expired keys are treated as unavailable

Example:

```text
SET name Saloni
+OK

EXPIRE name 10
:1

TTL name
:10

PERSIST name
:1
```

---

## 🧱 Data Structures

The server supports three Redis-style data types:

### Strings

Basic key-value storage.

```text
SET name Saloni
GET name
DEL name
EXISTS name
```

### Lists

Ordered collections with Redis-style list operations.

Supported operations include:

```text
LPUSH
RPUSH
LPOP
RPOP
LLEN
LRANGE
```

### Hashes

Field-value collections stored under a key.

Supported operations include:

```text
HSET
HGET
HDEL
HEXISTS
HGETALL
```

---

# 📢 Pub/Sub

The server also implements a lightweight **Redis-style Publish/Subscribe system**.

Pub/Sub allows clients to communicate through channels without storing published messages as normal database keys.

Supported commands:

* `SUBSCRIBE`
* `PUBLISH`
* `UNSUBSCRIBE`

A client can subscribe to a channel, while another client can publish messages to that channel.

All currently subscribed clients receive the published message.

---

## 🔄 Pub/Sub Architecture

```text
                    Publisher Client
                           │
                           │ PUBLISH
                           ▼
                  ┌──────────────────┐
                  │   Pub/Sub Manager │
                  └─────────┬────────┘
                            │
                    Broadcast Message
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
          Subscriber A Subscriber B Subscriber C
```

---

## 📡 Subscribe

A client can subscribe to a channel:

```text
SUBSCRIBE news
```

The client is then registered as a subscriber of the `news` channel.

---

## 📤 Publish

Another client can publish a message:

```text
PUBLISH news Hello
```

The message is automatically delivered to all clients subscribed to `news`.

Example:

```text
Client 1:

SUBSCRIBE news
```

```text
Client 2:

PUBLISH news Hello
```

Client 1 receives a RESP-style message:

```text
*3
$7
message
$4
news
$5
Hello
```

---

## 📥 Unsubscribe

A client can leave a channel using:

```text
UNSUBSCRIBE news
```

The client is removed from the channel's subscriber list.

---

## 🧠 Pub/Sub Implementation

The Pub/Sub implementation maintains channel-to-client relationships.

Conceptually:

```text
Channel
   │
   ├── Client A
   ├── Client B
   └── Client C
```

When a message is published:

```text
PUBLISH channel message
             │
             ▼
       Find subscribers
             │
             ▼
       Broadcast message
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
      A      B     C
```

The implementation includes:

* Channel-based subscriptions
* Multiple subscribers per channel
* Message broadcasting
* Duplicate-subscription prevention
* `UNSUBSCRIBE` support
* Cleanup of disconnected clients
* RESP-style Pub/Sub responses

The Pub/Sub logic is separated into its own module:

```text
src/pubsub.js
```

This keeps messaging logic separate from the main database storage.

---

# 💾 Persistence

The project implements **snapshot-based persistence**.

The database normally operates in memory, but its state can be written to disk so that data can be restored after restarting the server.

```text
             ┌─────────────────┐
             │  In-Memory Store │
             └────────┬────────┘
                      │
                      │ Snapshot
                      ▼
             ┌─────────────────┐
             │  data/dump.json │
             └────────┬────────┘
                      │
                      │ Server Restart
                      ▼
             ┌─────────────────┐
             │ Restore Store   │
             └─────────────────┘
```

### Persistence Flow

1. Data is stored in the in-memory store.
2. The current database state is serialized.
3. A snapshot is written to `data/dump.json`.
4. When the server starts again, the snapshot is loaded.
5. Previously persisted data becomes available again.

The runtime database file is intentionally ignored by Git.

> Pub/Sub subscriptions are runtime connections and are not persisted in the database snapshot.

---

# 📡 RESP-Style Communication

The client-server communication follows **RESP-style Redis responses** rather than returning arbitrary plain-text output.

### Simple String

```text
SET name Saloni

+OK
```

### Bulk String

```text
GET name

$6
Saloni
```

### Integer

```text
EXISTS name

:1
```

### Delete

```text
DEL name

:1
```

### Pub/Sub Message

```text
PUBLISH news Hello
```

Subscribers receive:

```text
*3
$7
message
$4
news
$5
Hello
```

This makes the server communication closer to the protocol used by Redis and provides a more realistic Redis implementation experience.

---

# 💻 Interactive CLI

A custom CLI client is included for communicating with the server.

Start the client with:

```bash
node client/client.js
```

The client provides an interactive environment where commands can be entered directly.

Example:

```text
> SET name Saloni
+OK

> GET name
$6
Saloni

> EXISTS name
:1

> DEL name
:1

> EXISTS name
:0
```

The same client can also be used for Pub/Sub operations.

---

# 🧩 Supported Commands

## String Commands

| Command         | Purpose                    |
| --------------- | -------------------------- |
| `SET key value` | Store a string value       |
| `GET key`       | Retrieve a string value    |
| `DEL key`       | Delete a key               |
| `EXISTS key`    | Check whether a key exists |

---

## Key Commands

| Command    | Purpose                |
| ---------- | ---------------------- |
| `KEYS`     | Return available keys  |
| `FLUSHALL` | Remove all stored keys |

---

## Expiration Commands

| Command              | Purpose                  |
| -------------------- | ------------------------ |
| `EXPIRE key seconds` | Set key expiration       |
| `TTL key`            | Check remaining lifetime |
| `PERSIST key`        | Remove expiration        |

---

## List Commands

| Command  | Purpose                           |
| -------- | --------------------------------- |
| `LPUSH`  | Insert values from the left       |
| `RPUSH`  | Insert values from the right      |
| `LPOP`   | Remove from the left              |
| `RPOP`   | Remove from the right             |
| `LLEN`   | Get list length                   |
| `LRANGE` | Retrieve a range of list elements |

---

## Hash Commands

| Command   | Purpose                         |
| --------- | ------------------------------- |
| `HSET`    | Set a hash field                |
| `HGET`    | Retrieve a hash field           |
| `HDEL`    | Delete a hash field             |
| `HEXISTS` | Check whether a field exists    |
| `HGETALL` | Retrieve hash fields and values |

---

## Pub/Sub Commands

| Command                   | Purpose                              |
| ------------------------- | ------------------------------------ |
| `SUBSCRIBE channel`       | Subscribe a client to a channel      |
| `PUBLISH channel message` | Publish a message to all subscribers |
| `UNSUBSCRIBE channel`     | Remove a client from a channel       |

### Example

**Client 1:**

```text
SUBSCRIBE chat
```

**Client 2:**

```text
PUBLISH chat Hello
```

**Client 1 receives:**

```text
*3
$7
message
$4
chat
$5
Hello
```

This demonstrates real-time message delivery between multiple TCP clients.

---

# 🏗️ Project Architecture

The project separates networking, command handling, storage, Pub/Sub, and persistence instead of putting everything inside one server file.

```text
my-redis/
│
├── client/
│   └── client.js
│
├── src/
│   ├── server.js
│   │
│   ├── command/
│   │   ├── ...
│   │   └── ...
│   │
│   ├── store/
│   │   └── store.js
│   │
│   ├── pubsub.js
│   │
│   └── persistence.js
│
├── data/
│   └── dump.json
│
├── package.json
├── package-lock.json
└── README.md
```

### `client/client.js`

Responsible for:

* Connecting to the Redis server
* Sending commands
* Receiving responses
* Providing the interactive CLI

### `src/server.js`

Responsible for:

* Starting the TCP server
* Accepting client connections
* Receiving commands
* Routing commands to handlers
* Sending responses back to clients
* Managing client connections

### `src/command/`

Contains the database command implementations.

Keeping commands separate makes the server easier to maintain and extend.

### `src/store/store.js`

Responsible for the in-memory database state.

This is the core storage layer used by database commands.

### `src/pubsub.js`

Responsible for Pub/Sub functionality.

It manages:

* Channels
* Subscribers
* Publishing
* Broadcasting
* Unsubscribing
* Disconnected client cleanup

### `src/persistence.js`

Responsible for:

* Saving database state
* Loading persisted state
* Restoring data after server restart

### `data/dump.json`

Contains the persisted snapshot of the database at runtime.

---

# 🔄 Request Lifecycle

A normal database command travels through several layers before a response reaches the client.

For example:

```text
Client
  │
  │ SET name Saloni
  ▼
TCP Server
  │
  ▼
Command Parser
  │
  ▼
SET Command Handler
  │
  ▼
In-Memory Store
  │
  ▼
RESP Response
  │
  ▼
Client
  │
  ▼
+OK
```

---

# 📢 Pub/Sub Request Lifecycle

Pub/Sub follows a different flow because messages are delivered to other connected clients.

```text
Publisher Client
       │
       │ PUBLISH news Hello
       ▼
   TCP Server
       │
       ▼
 Pub/Sub Handler
       │
       ▼
 Pub/Sub Manager
       │
       │ Find subscribers
       ▼
 ┌─────┼─────┐
 ▼     ▼     ▼
 A     B     C
 │     │     │
 ▼     ▼     ▼
Message Message Message
```

Unlike normal `SET`/`GET` operations, a published message is **broadcast directly to subscribed client connections**.

---

# 🌐 Networking

The server uses Node.js TCP networking rather than HTTP.

This is important because Redis communicates through a TCP-based client-server protocol.

The server supports multiple client connections:

```text
Client A ─────┐
              │
Client B ─────┼──────► TCP Server
              │             │
Client C ─────┘             │
                            ├────► Store
                            │
                            └────► Pub/Sub
```

This architecture allows one client to publish a message while other connected clients receive it through their active TCP connections.

---

# 🛠️ Tech Stack

| Technology          | Purpose                 |
| ------------------- | ----------------------- |
| JavaScript          | Application language    |
| Node.js             | Runtime environment     |
| `net` module        | TCP networking          |
| `fs`                | File-based persistence  |
| JSON                | Snapshot storage        |
| RESP-style protocol | Client-server responses |
| Git                 | Version control         |
| GitHub              | Source-code hosting     |

No external Redis server is used as the database.

No external database is required.

---

# ⚙️ Installation

## Prerequisites

Make sure Node.js and npm are installed.

Check:

```bash
node --version
npm --version
```

---

## Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd my-redis
```

---

## Install Dependencies

```bash
npm install
```

---

# ▶️ Running the Project

## Step 1 — Start the Server

From the project root:

```bash
node src/server.js
```

The Redis-like server will start listening for TCP connections.

---

## Step 2 — Start the Client

Open another terminal:

```bash
node client/client.js
```

You can now execute Redis-style commands.

---

# 🧪 Testing

The implementation was tested incrementally while adding each feature.

## Basic Key-Value Testing

```text
SET name Saloni
GET name
EXISTS name
DEL name
EXISTS name
```

Expected flow:

```text
SET name Saloni
+OK

GET name
$6
Saloni

EXISTS name
:1

DEL name
:1

EXISTS name
:0
```

---

## Key Management Testing

```text
SET name Saloni
SET city Gaya
KEYS
FLUSHALL
KEYS
```

This verifies:

* Multiple keys
* Key listing
* Complete database clearing

---

## Expiration Testing

```text
SET name Saloni
EXPIRE name 5
TTL name
```

After expiration:

```text
GET name
```

The expired key should no longer be available.

---

## Persistence Testing

Persistence was tested using the following flow:

```text
1. Start server
2. SET keys
3. Persist snapshot
4. Stop server
5. Start server again
6. Read previously persisted keys
```

This verifies that database state can survive a server restart.

---

## List Testing

List commands were tested for:

* Inserting elements from both ends
* Removing elements from both ends
* Checking list length
* Reading list ranges

Example:

```text
LPUSH numbers one
RPUSH numbers two
LLEN numbers
LPOP numbers
RPOP numbers
```

---

## Hash Testing

Hash operations were tested for:

* Creating fields
* Reading fields
* Checking field existence
* Deleting fields
* Reading complete hashes

Example:

```text
HSET user name Saloni
HGET user name
HEXISTS user name
HGETALL user
HDEL user name
```

---

## Pub/Sub Testing

Pub/Sub was tested using multiple client connections.

### Step 1 — Start the Server

```bash
node src/server.js
```

### Step 2 — Start Subscriber Client

In Terminal 1:

```bash
node client/client.js
```

Then:

```text
SUBSCRIBE news
```

### Step 3 — Start Publisher Client

In Terminal 2:

```bash
node client/client.js
```

Then:

```text
PUBLISH news Hello
```

### Step 4 — Verify Message Delivery

The subscribed client receives the published message:

```text
*3
$7
message
$4
news
$5
Hello
```

### Pub/Sub Tests Cover

* Channel subscription
* Publishing messages
* Message broadcasting
* Multiple subscribers
* Duplicate subscription prevention
* Unsubscription
* Cleanup after client disconnects
* RESP-style message formatting

---

# 📊 Feature Summary

| Feature                           | Status |
| --------------------------------- | :----: |
| Custom TCP Server                 |    ✅   |
| Multiple Clients                  |    ✅   |
| Interactive CLI                   |    ✅   |
| `SET` / `GET`                     |    ✅   |
| `DEL` / `EXISTS`                  |    ✅   |
| `KEYS`                            |    ✅   |
| `FLUSHALL`                        |    ✅   |
| `EXPIRE`                          |    ✅   |
| `TTL`                             |    ✅   |
| `PERSIST`                         |    ✅   |
| Real Key Expiration               |    ✅   |
| Strings                           |    ✅   |
| Lists                             |    ✅   |
| Hashes                            |    ✅   |
| Snapshot Persistence              |    ✅   |
| Restore on Restart                |    ✅   |
| RESP-style Responses              |    ✅   |
| Pub/Sub                           |    ✅   |
| `SUBSCRIBE`                       |    ✅   |
| `PUBLISH`                         |    ✅   |
| `UNSUBSCRIBE`                     |    ✅   |
| Multiple Subscribers              |    ✅   |
| Message Broadcasting              |    ✅   |
| Duplicate Subscription Prevention |    ✅   |
| Disconnect Cleanup                |    ✅   |

---

# 🧠 What We Learned

Building a Redis-like server from scratch provided practical experience with several backend and systems concepts.

### 1. TCP Networking

Instead of using HTTP, the project communicates directly through TCP sockets.

### 2. Client-Server Architecture

The client and database server are separate programs communicating over a network connection.

### 3. In-Memory Storage

The database maintains its active state in memory for fast access.

### 4. Data Structures

Different Redis-style data types require different internal representations and command behavior.

### 5. Expiration

Keys need metadata associated with their lifetime and must be treated differently once they expire.

### 6. Persistence

An in-memory database can be combined with disk snapshots to recover state after a restart.

### 7. Pub/Sub Messaging

Pub/Sub demonstrates how connected clients can communicate through channels without storing messages as normal database values.

### 8. Protocol Design

Using RESP-style responses demonstrates how databases communicate structured responses to clients.

### 9. Modular Backend Design

Separating commands, storage, networking, Pub/Sub, and persistence makes the project easier to understand and extend.

---

# 🔐 Error Handling

The server validates commands before executing them.

Invalid operations should return an appropriate error response rather than silently modifying the database.

Examples of validation include:

* Unknown commands
* Missing command arguments
* Invalid argument counts
* Invalid expiration values
* Operations performed against incompatible data types
* Invalid Pub/Sub operations

---

# ⚖️ My Redis vs Redis

| Capability                   | Redis | My Redis |
| ---------------------------- | :---: | :------: |
| In-memory database           |   ✅   |     ✅    |
| TCP communication            |   ✅   |     ✅    |
| Multiple clients             |   ✅   |     ✅    |
| Strings                      |   ✅   |     ✅    |
| Lists                        |   ✅   |     ✅    |
| Hashes                       |   ✅   |     ✅    |
| Expiration                   |   ✅   |     ✅    |
| TTL                          |   ✅   |     ✅    |
| Persistence                  |   ✅   |     ✅    |
| Redis-style protocol         |   ✅   |     ✅    |
| Interactive client           |   ✅   |     ✅    |
| Pub/Sub                      |   ✅   |     ✅    |
| Complete Redis command set   |   ✅   |     ❌    |
| Production-grade performance |   ✅   |     ❌    |
| High availability            |   ✅   |     ❌    |
| Replication                  |   ✅   |     ❌    |
| Advanced eviction policies   |   ✅   |     ❌    |

This project is intentionally a **learning-focused Redis implementation**, not a production replacement for Redis.

---

# 🚧 Future Improvements

The architecture can be extended with additional Redis features.

Potential future work includes:

* Transactions using `MULTI` / `EXEC`
* Append Only File (AOF) persistence
* LRU/LFU eviction
* Master-replica replication
* `EVAL` scripting
* `AUTH`
* Benchmarking and operations-per-second measurements
* Pattern-based Pub/Sub such as `PSUBSCRIBE`

These are considered extensions beyond the currently implemented functionality.

---

# 🎯 Hackathon Objective

The purpose of this project was not simply to create a key-value store.

The larger objective was to understand:

```text
How does a database server
receive a command,
interpret it,
modify internal state,
return a protocol response,
handle expiration,
persist its state,
and communicate with other clients?
```

The project answers that question by implementing the major flows ourselves:

```text
                    COMMAND
                       │
                       ▼
                 TCP CONNECTION
                       │
                       ▼
                 COMMAND PARSER
                       │
                       ▼
                COMMAND HANDLER
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        DATA STORE            PUB/SUB
             │                   │
       ┌─────┼─────┐             │
       ▼     ▼     ▼             ▼
    String List  Hash       Channel Manager
       │     │     │             │
       └─────┼─────┘             │
             │                   │
             ▼                   ▼
        EXPIRATION          MESSAGE BROADCAST
             │                   │
             └─────────┬─────────┘
                       ▼
                  RESP RESPONSE
                       │
                       ▼
                    CLIENT
```

---

# 📈 Project Highlights

### 🏗️ Built From Scratch

The core database functionality was implemented rather than using an existing Redis server.

### 🌐 Network Based

The database is accessed through TCP, providing an actual client-server architecture.

### 🧱 Multiple Data Types

The server supports:

```text
Strings
Lists
Hashes
```

### ⏳ Key Expiration

Keys can automatically expire after a specified amount of time.

### 💾 Persistence

Database snapshots allow data to be restored after restarting the server.

### 📢 Real-Time Pub/Sub

Clients can subscribe to channels and receive messages published by other clients in real time.

```text
Publisher
    │
    ▼
 Channel
    │
 ┌──┼──┐
 ▼  ▼  ▼
 A  B  C
```

### 💻 Custom Client

The project includes its own interactive CLI for interacting with the database.

### 📡 RESP-Style Responses

The server returns structured Redis-style responses instead of arbitrary plain text.

### 🧩 Modular Architecture

Commands, storage, persistence, networking, and Pub/Sub are separated into different modules.

---

# 📁 Repository Structure

```text
my-redis/
│
├── client/
│   └── client.js
│
├── src/
│   ├── server.js
│   │
│   ├── command/
│   │   └── ...
│   │
│   ├── store/
│   │   └── store.js
│   │
│   ├── pubsub.js
│   │
│   └── persistence.js
│
├── data/
│   └── dump.json
│
├── package.json
├── package-lock.json
└── README.md
```

---

# 👩‍💻 Author

**Saloni Kumari**

B.Tech — Computer Science & Engineering

### Build Your Own Redis Hackathon

Built with **Node.js, TCP networking, data structures, persistence, Pub/Sub, and a lot of debugging.** 🚀

---

# ⭐ Final Note

This project started as an exploration of how Redis works internally and evolved into a functional Redis-inspired database with:

```text
       TCP Server
           +
      Custom CLI
           +
     Redis Commands
           +
     3 Data Types
           +
       Expiration
           +
       Persistence
           +
    RESP-style Output
           +
        Pub/Sub
           │
           ▼
      My Redis 🚀
```

The project demonstrates how core database functionality, persistence, expiration, and real-time client communication can be built from the ground up using Node.js.

If you found this project interesting, consider giving the repository a ⭐.
