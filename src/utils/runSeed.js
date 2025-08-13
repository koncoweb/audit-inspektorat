import { seedFollowUpData } from './seedFollowUpData.js';
import { seedAuditData } from './seedAuditData.js';
import { seedAuditFindingsData } from './seedAuditFindingsData.js';

// Function to run seed data
export const runSeedData = async () => {
  try {
    console.log('Starting to seed follow-up data...');
    await seedFollowUpData();
    console.log('Follow-up seed data completed successfully!');
  } catch (error) {
    console.error('Error running follow-up seed data:', error);
  }
};

// Function to run audit seed data
export const runAuditSeedData = async () => {
  try {
    console.log('Starting to seed audit data...');
    await seedAuditData();
    console.log('Audit seed data completed successfully!');
  } catch (error) {
    console.error('Error running audit seed data:', error);
  }
};

// Function to run findings seed data
export const runFindingsSeedData = async () => {
  try {
    console.log('Starting to seed findings data...');
    await seedAuditFindingsData();
    console.log('Findings seed data completed successfully!');
  } catch (error) {
    console.error('Error running findings seed data:', error);
  }
};

// Function to run all seed data
export const runAllSeedData = async () => {
  try {
    console.log('Starting to seed all data...');
    await seedAuditData();
    await seedAuditFindingsData();
    await seedFollowUpData();
    console.log('All seed data completed successfully!');
  } catch (error) {
    console.error('Error running all seed data:', error);
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.runSeedData = runSeedData;
  window.runAuditSeedData = runAuditSeedData;
  window.runFindingsSeedData = runFindingsSeedData;
  window.runAllSeedData = runAllSeedData;
}
