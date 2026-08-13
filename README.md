# MyRedis

A simplified Redis-like in-memory key-value database built from scratch.
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

* Custom TCP server built using Node.js
* Multiple client connections
* In-memory key-value storage
* Command parsing and execution
* Redis-style command responses formated
* Interactive CLI client
* Error handling for invalid commands and operations

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
---

# ⚙️ Installation

## Prerequisites

Make sure Node.js and npm are installed:

```bash
node --version
npm --version
```

## Clone & Install

```bash
git clone <https://github.com/saloni-mehra/my-redis.git>
cd my-redis
npm install
```

## ▶️ Running

**Start the server:**

```bash
node src/server.js
```

**Start the client in another terminal:**

```bash
node client/client.js
```
You can now execute Redis-style commands.
---

# 🧩 Supported Commands

| Category       | Command                   | Purpose                             |
| -------------- | ------------------------- | ----------------------------------- |
| **Strings**    | `SET key value`           | Store a string value                |
|                | `GET key`                 | Retrieve a string value             |
|                | `DEL key`                 | Delete a key                        |
|                | `EXISTS key`              | Check whether a key exists          |
| **Keys**       | `KEYS`                    | List available keys                 |
|                | `FLUSHALL`                | Remove all stored keys              |
| **Expiration** | `EXPIRE key seconds`      | Set key expiration                  |
|                | `TTL key`                 | Check remaining lifetime            |
|                | `PERSIST key`             | Remove key expiration               |
| **Lists**      | `LPUSH key value`         | Insert values from the left         |
|                | `RPUSH key value`         | Insert values from the right        |
|                | `LPOP key`                | Remove from the left                |
|                | `RPOP key`                | Remove from the right               |
|                | `LLEN key`                | Get list length                     |
|                | `LRANGE key start stop`   | Retrieve a range of elements        |
| **Hashes**     | `HSET key field value`    | Set a hash field                    |
|                | `HGET key field`          | Retrieve a hash field               |
|                | `HDEL key field`          | Delete a hash field                 |
|                | `HEXISTS key field`       | Check whether a field exists        |
|                | `HGETALL key`             | Retrieve all hash fields and values |
| **Pub/Sub**    | `SUBSCRIBE channel`       | Subscribe to a channel              |
|                | `PUBLISH channel message` | Publish a message to subscribers    |
|                | `UNSUBSCRIBE channel`     | Unsubscribe from a channel          |

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

The runtime database file is intentionally ignored by Git.

> Pub/Sub subscriptions are runtime connections and are not persisted in the database snapshot.

---
# 📡 RESP-Style Communication

“Implemented RESP-based client-server communication with RESP request parsing and response formatting.”

---
# 💻 Interactive CLI

A custom CLI client is included for communicating with the server.

Start the client with:

```bash
node client/client.js
```

The client provides an interactive environment where commands can be entered directly.

## Example:

```text
> SET name Saloni
"OK"

> GET name
"Saloni"

> EXISTS name
(integer)1
`
The same client can also be used for Pub/Sub operations.
```
---

##🚀 Testing 
Each feature was tested incrementally through the interactive CLI and multiple client connections.

| Feature            | What was verified                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **Strings & Keys** | `SET`, `GET`, `DEL`, `EXISTS`, `KEYS`, and `FLUSHALL`                                      |
| **Expiration**     | Key expiry using `EXPIRE`, remaining time with `TTL`, and removal of expiry with `PERSIST` |
| **Lists**          | Insertion, removal, length, and range operations                                           |
| **Hashes**         | Field creation, retrieval, deletion, existence checks, and complete hash retrieval         |
| **Persistence**    | Data survives server restart using `dump.json`                                             |
| **Pub/Sub**        | Messages are delivered between separate client connections                                 |

### Quick CLI Test

```text
> SET name Saloni
"OK"

> GET name
"Saloni"

> EXPIRE name 5
(integer) 1

> TTL name
(integer) 5
```

After the key expires:

```text
> GET name
(nil)
```

The key should no longer be available.

### Persistence Test

```text
1. Start server
2. Store some keys
3. Stop server
4. Start server again
5. Verify the keys are restored
```

### Pub/Sub Test

Open two client terminals:

```text
Client 1 → SUBSCRIBE news
Client 2 → PUBLISH news Hello
```

The subscriber should receive the published message.

> All command testing uses the project's RESP-style responses with a user-friendly formatted display.
---

# 💻 Example Usage
After starting the server and client, commands can be executed directly from the interactive CLI.

```text
SET name Saloni
"ok"

GET name
"Saloni"

SET city Gaya
"OK"

KEYS
"name
city"

EXPIRE name 60
(integer)1

TTL name
(integer)59

LPUSH skills JavaScript
(integer)1

LPUSH skills Node.js
(integer)2

LRANGE skills 0 -1
"Node.js
JavaScript"

HSET user name Saloni
(integer)1

HGET user name
"Saloni"
```
For Pub/Sub, use two client connections:

```text
Client 1:
SUBSCRIBE news

Client 2:
PUBLISH news Hello
```
The subscribed client receives the published message.
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

---

The project demonstrates how core database functionality, persistence, expiration, and real-time client communication can be built from the ground up using Node.js.

If you found this project interesting, consider giving the repository a ⭐.
