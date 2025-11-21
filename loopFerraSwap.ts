import { swapAllFerraCT, swapAllFerraTC } from './ferraSwap';

// Loop configuration interface
interface LoopConfig {
  interval: number;      // Interval time (milliseconds)
  maxIterations?: number; // Maximum iterations (optional, infinite loop if not set)
  delayStart?: number;   // Start delay (milliseconds)
}

// Loop execution
async function loopSwapAllFerra(config: LoopConfig): Promise<void> {
  const { interval, maxIterations, delayStart = 0 } = config;

  console.log(`=== Starting loop execution ===`);
  console.log(`Configuration: interval ${interval}ms, ${maxIterations ? `maximum ${maxIterations} times` : 'infinite loop'}`);

  if (delayStart > 0) {
    console.log(`Starting after ${delayStart}ms delay...`);
    await new Promise(resolve => setTimeout(resolve, delayStart));
  }

  let iteration = 0;

  while (maxIterations === undefined || iteration < maxIterations) {
    iteration++;
    const startTime = Date.now();

    console.log(`\n--- Execution ${iteration} ---`);
    console.log(`Start time: ${new Date().toLocaleString()}`);

    try {
      await swapAllFerraCT();
      console.log(`✅ Execution ${iteration} successful`);
    } catch (error) {
      console.error(`❌ Execution ${iteration} failed:`, error);
    }

    const executionTime = Date.now() - startTime;
    console.log(`Execution time: ${executionTime}ms`);

    // If not the last execution, wait for interval time
    if (maxIterations === undefined || iteration < maxIterations) {
      const waitTime = Math.max(0, interval - executionTime);
      console.log(`Waiting ${waitTime}ms before next execution...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  console.log(`\n=== Loop execution completed ===`);
  console.log(`Total executions: ${iteration} times`);
}

// Graceful shutdown handling
let isStopping = false;

function setupGracefulShutdown(): void {
  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT signal, gracefully stopping...');
    isStopping = true;
  });

  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM signal, gracefully stopping...');
    isStopping = true;
  });
}

// Main function
async function main() {
  // Configure loop parameters
  const config: LoopConfig = {
    interval: 5000,        // 5 second interval
    maxIterations: 10,     // Execute 10 times
    delayStart: 1000,      // Start after 1 second
  };

  // Set up graceful shutdown
  setupGracefulShutdown();

  try {
    await loopSwapAllFerra(config);
  } catch (error) {
    console.error('Loop execution failed:', error);
    process.exit(1);
  }
}

// If running this file directly
if (import.meta.main) {
  main().catch(console.error);
}

// Export functions for other modules to use
export { loopSwapAllFerra, type LoopConfig };