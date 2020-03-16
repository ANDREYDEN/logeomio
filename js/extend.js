Worker.prototype.processData = function ({ data, onComplete }) {
    const handleCompletion = message => {
        onComplete(message.data)
        this.removeEventListener('message', handleCompletion)
    }
    this.addEventListener('message', handleCompletion)
    this.addEventListener('error', err => {
        console.log(`${err.filename} (${err.lineno}): ${err.message}`);
    })
    this.postMessage(data)
}