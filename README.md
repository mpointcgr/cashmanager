# Daily Cash Manager

A comprehensive desktop application for managing daily cash transactions, built with React and Electron.

## Features

- **Cash Counter**: Track physical cash by Indian denominations (notes and coins)
- **Multiple Balance Types**: Manage CSC, CSP, and other digital balances
- **Transaction History**: Complete record of all cash movements
- **Daily Status Tracking**: Morning and evening cash position recording
- **Financial Reports**: Visual analytics and cash flow trends
- **Data Export/Import**: Backup and restore your financial data
- **Offline Operation**: Works completely offline once installed

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Running in Development
```bash
# Web version
npm run dev

# Desktop version (Electron)
npm run electron:dev
```

### Building for Production

#### Web Build
```bash
npm run build
```

#### Desktop Application

**Windows (.exe)**
```bash
npm run electron:dist-win
```

**macOS (.dmg)**
```bash
npm run electron:dist-mac
```

**Linux (.AppImage, .deb)**
```bash
npm run electron:dist-linux
```

**All Platforms**
```bash
npm run electron:dist
```

The built applications will be available in the `release/` directory.

### Desktop App Features

- Native desktop integration
- System tray support
- File association for backup files
- Keyboard shortcuts
- Auto-updater ready
- Cross-platform compatibility

## Usage

1. **Cash Counting**: Use the Cash Counter tab to manually count your physical cash by denomination
2. **Quick Transactions**: Add or remove cash with reasons using the action buttons
3. **Daily Tracking**: Record morning and evening cash positions for variance analysis
4. **Balance Management**: Track CSC, CSP, and other digital balances alongside physical cash
5. **Reports**: View trends and analytics in the Reports section
6. **Data Management**: Export your data for backup or import from previous backups

## Data Storage

- **Web Version**: Data stored in browser's localStorage
- **Desktop Version**: Data stored locally on your computer
- **Backup**: Export/import functionality for data portability

## Security

- All data stored locally
- No internet connection required
- No data transmitted to external servers
- Secure Electron configuration with context isolation

## License

Private use only.
