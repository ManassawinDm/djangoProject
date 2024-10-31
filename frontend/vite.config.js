import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // หรือใส่เป็น '0.0.0.0' เพื่อให้เข้าถึงจากเครื่องอื่นได้
    port: 5173, // สามารถเปลี่ยนพอร์ตได้ถ้าต้องการ
  },
})
