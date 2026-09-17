import "dotenv/config";
import mongoose from "mongoose";
import { Env } from "./config/env.config";
import UserModel from "./models/user.model";
import TransactionModel, {
  TransactionTypeEnum,
  TransactionStatusEnum,
  PaymentMethodEnum,
  RecurringIntervalEnum,
} from "./models/transaction.model";
import ReportSettingModel, {
  ReportFrequencyEnum,
} from "./models/report-setting.model";
import ReportModel, { ReportStatusEnum } from "./models/report.model";

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

async function seed() {
  await mongoose.connect(Env.MONGO_URI);
  console.log("Connected to DB");

  // Clear existing seed data
  await UserModel.deleteMany({ email: "demo@finora.app" });
  const oldUser = await UserModel.findOne({ email: "demo@finora.app" }).lean();
  if (oldUser) {
    await TransactionModel.deleteMany({ userId: oldUser._id });
    await ReportSettingModel.deleteMany({ userId: oldUser._id });
    await ReportModel.deleteMany({ userId: oldUser._id });
  }

  // Create demo user (password will be hashed by pre-save hook)
  const user = await UserModel.create({
    name: "Demo User",
    email: "demo@finora.app",
    password: "Demo@1234",
    profilePicture: null,
  });
  console.log("User created:", user.email);

  const uid = user._id;

  // Transactions — mix of income & expenses over last 90 days
  const transactions = [
    // INCOME
    { title: "Monthly Salary", type: "INCOME", amount: 5000, category: "Salary", paymentMethod: "BANK_TRANSFER", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(1) },
    { title: "Freelance Project", type: "INCOME", amount: 1200, category: "Freelance", paymentMethod: "BANK_TRANSFER", isRecurring: false, date: daysAgo(10) },
    { title: "Stock Dividend", type: "INCOME", amount: 340, category: "Investment", paymentMethod: "BANK_TRANSFER", isRecurring: false, date: daysAgo(20) },
    { title: "Monthly Salary", type: "INCOME", amount: 5000, category: "Salary", paymentMethod: "BANK_TRANSFER", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(31) },
    { title: "Side Project Revenue", type: "INCOME", amount: 800, category: "Freelance", paymentMethod: "MOBILE_PAYMENT", isRecurring: false, date: daysAgo(45) },
    { title: "Monthly Salary", type: "INCOME", amount: 5000, category: "Salary", paymentMethod: "BANK_TRANSFER", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(61) },
    { title: "Rental Income", type: "INCOME", amount: 1500, category: "Rental", paymentMethod: "BANK_TRANSFER", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(62) },
    { title: "Bonus", type: "INCOME", amount: 2000, category: "Salary", paymentMethod: "BANK_TRANSFER", isRecurring: false, date: daysAgo(75) },

    // EXPENSE
    { title: "Rent", type: "EXPENSE", amount: 1400, category: "Housing", paymentMethod: "BANK_TRANSFER", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(2) },
    { title: "Grocery Shopping", type: "EXPENSE", amount: 180, category: "Food & Dining", paymentMethod: "CARD", isRecurring: false, date: daysAgo(3) },
    { title: "Netflix Subscription", type: "EXPENSE", amount: 15, category: "Entertainment", paymentMethod: "CARD", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(4) },
    { title: "Electricity Bill", type: "EXPENSE", amount: 95, category: "Utilities", paymentMethod: "AUTO_DEBIT", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(5) },
    { title: "Gym Membership", type: "EXPENSE", amount: 50, category: "Health & Fitness", paymentMethod: "AUTO_DEBIT", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(6) },
    { title: "Restaurant Dinner", type: "EXPENSE", amount: 75, category: "Food & Dining", paymentMethod: "CARD", isRecurring: false, date: daysAgo(8) },
    { title: "Uber Ride", type: "EXPENSE", amount: 22, category: "Transport", paymentMethod: "MOBILE_PAYMENT", isRecurring: false, date: daysAgo(9) },
    { title: "Amazon Purchase", type: "EXPENSE", amount: 130, category: "Shopping", paymentMethod: "CARD", isRecurring: false, date: daysAgo(12) },
    { title: "Internet Bill", type: "EXPENSE", amount: 60, category: "Utilities", paymentMethod: "AUTO_DEBIT", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(14) },
    { title: "Coffee Shop", type: "EXPENSE", amount: 18, category: "Food & Dining", paymentMethod: "CARD", isRecurring: false, date: daysAgo(15) },
    { title: "Rent", type: "EXPENSE", amount: 1400, category: "Housing", paymentMethod: "BANK_TRANSFER", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(32) },
    { title: "Grocery Shopping", type: "EXPENSE", amount: 210, category: "Food & Dining", paymentMethod: "CARD", isRecurring: false, date: daysAgo(35) },
    { title: "Doctor Visit", type: "EXPENSE", amount: 120, category: "Healthcare", paymentMethod: "CARD", isRecurring: false, date: daysAgo(38) },
    { title: "Spotify", type: "EXPENSE", amount: 10, category: "Entertainment", paymentMethod: "CARD", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(40) },
    { title: "Fuel", type: "EXPENSE", amount: 65, category: "Transport", paymentMethod: "CARD", isRecurring: false, date: daysAgo(42) },
    { title: "Rent", type: "EXPENSE", amount: 1400, category: "Housing", paymentMethod: "BANK_TRANSFER", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(63) },
    { title: "Grocery Shopping", type: "EXPENSE", amount: 195, category: "Food & Dining", paymentMethod: "CARD", isRecurring: false, date: daysAgo(66) },
    { title: "Phone Bill", type: "EXPENSE", amount: 45, category: "Utilities", paymentMethod: "AUTO_DEBIT", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(68) },
    { title: "New Shoes", type: "EXPENSE", amount: 90, category: "Shopping", paymentMethod: "CARD", isRecurring: false, date: daysAgo(72) },
    { title: "Online Course", type: "EXPENSE", amount: 49, category: "Education", paymentMethod: "CARD", isRecurring: false, date: daysAgo(80) },
    { title: "Restaurant Lunch", type: "EXPENSE", amount: 35, category: "Food & Dining", paymentMethod: "CASH", isRecurring: false, date: daysAgo(85) },
    { title: "Insurance Premium", type: "EXPENSE", amount: 200, category: "Insurance", paymentMethod: "AUTO_DEBIT", isRecurring: true, recurringInterval: "MONTHLY", date: daysAgo(88) },
  ];

  const txDocs = transactions.map((t) => ({
    userId: uid,
    title: t.title,
    type: t.type as keyof typeof TransactionTypeEnum,
    amount: t.amount,
    category: t.category,
    paymentMethod: t.paymentMethod as keyof typeof PaymentMethodEnum,
    isRecurring: t.isRecurring,
    recurringInterval: t.recurringInterval as keyof typeof RecurringIntervalEnum | undefined,
    nextRecurringDate: t.isRecurring ? daysAgo(-30) : null,
    status: "COMPLETED" as keyof typeof TransactionStatusEnum,
    date: t.date,
    description: "",
  }));

  await TransactionModel.insertMany(txDocs);
  console.log(`${txDocs.length} transactions inserted`);

  // Report settings
  await ReportSettingModel.create({
    userId: uid,
    frequency: ReportFrequencyEnum.MONTHLY,
    isEnabled: true,
    nextReportDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    lastSentDate: new Date(now.getFullYear(), now.getMonth(), 1),
  });
  console.log("Report settings created");

  // Report history — last 6 months
  const reportHistory = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const period = d.toLocaleString("default", { month: "long", year: "numeric" });
    return {
      userId: uid,
      period,
      sentDate: new Date(now.getFullYear(), now.getMonth() - i + 1, 1), // sent on 1st of next month
      status: i === 0 ? ReportStatusEnum.PENDING : ReportStatusEnum.SENT,
    };
  });
  await ReportModel.insertMany(reportHistory);
  console.log(`${reportHistory.length} report history entries inserted`);

  await mongoose.disconnect();
  console.log("\n✅ Seed complete!");
  console.log("   Email:    demo@finora.app");
  console.log("   Password: Demo@1234");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
