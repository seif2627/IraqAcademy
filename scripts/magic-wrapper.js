const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const targetFile = process.env.MAGIC_TARGET_FILE || "components/magic/latest-component.html";
const args = process.argv.slice(2);
const messageIndex = args.indexOf("--message");
const message = messageIndex !== -1 ? args[messageIndex + 1] : "Create a simple component";

console.error(`[Magic-Wrapper] Target file: ${targetFile}`);
console.error(`[Magic-Wrapper] Message: ${message}`);

const child = spawn(
  "npx",
  ["-y", "@21st-dev/magic@latest", "21st_magic_component_builder", "--message", message],
  {
    stdio: ["inherit", "pipe", "inherit"],
    env: {
      ...process.env,
      MAGIC_OUTPUT_MODE: "stdout"
    },
    shell: true
  }
);

let outputBuffer = "";

child.stdout.on("data", (data) => {
  const str = data.toString();
  outputBuffer += str;
  process.stdout.write(data);
});

child.on("close", (code) => {
  if (code === 0 && outputBuffer.trim()) {
    try {
      const dir = path.dirname(targetFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      let cleanContent = outputBuffer;
      if (cleanContent.includes("---MAGIC_OUTPUT_START---")) {
        cleanContent = cleanContent.split("---MAGIC_OUTPUT_START---")[1].split("---MAGIC_OUTPUT_END---")[0];
      }

      fs.writeFileSync(targetFile, cleanContent.trim());
      console.error(`\n[Magic-Wrapper] Success! Written to ${targetFile}`);
    } catch (err) {
      console.error(`\n[Magic-Wrapper] Error writing file: ${err.message}`);
    }
  } else {
    console.error(`\n[Magic-Wrapper] Process exited with code ${code} or empty output.`);
  }
});
