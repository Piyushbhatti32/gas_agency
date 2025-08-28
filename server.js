import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const defaultPort = 3000
const maxPortTries = 10

// Find an available port starting from defaultPort
async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + maxPortTries; port++) {
    try {
      await new Promise((resolve, reject) => {
        const testServer = createServer()
        testServer.listen(port, hostname)
          .once('listening', () => {
            testServer.close()
            resolve(port)
          })
          .once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              resolve(false)
            } else {
              reject(err)
            }
          })
      })
      return port
    } catch (err) {
      console.error(`Error testing port ${port}:`, err)
      continue
    }
  }
  throw new Error('No available ports found')
}

const port = await findAvailablePort(defaultPort)
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handler(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Socket.IO setup
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('join-room', (room) => {
      socket.join(room)
      console.log(`Client ${socket.id} joined room: ${room}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  // Make io available to the app
  global.io = io

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log(`> Socket.IO server running at ws://${hostname}:${port}/api/socketio`)
    })
})