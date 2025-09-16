import { DataSource } from "typeorm";
import { config } from "../config/config";

export class DatabaseService {
    private static instance: DatabaseService;
    private datasource: DataSource;
    private isConnected: boolean = false;

    private constructor () {

        this.datasource = new DataSource({
            type: "postgres",
            host: config.host,
            port: config.portDB,
            username: config.username,
            password: config.password,
            database: config.database,
            entities: ["src/models/*.model.ts"],
            synchronize: config.env !== 'production',
            logging: config.env === 'development',
            ssl: config.env === 'production' ? { rejectUnauthorized: false } : false,
        })
    }



    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public async connect(): Promise<DataSource> {
        if (this.isConnected) {
            console.log("Database is already connected.");
            return this.datasource;
        }

        try {
            console.log(`Connecting to PostgreSQL database in ${config.env} environment...`);
            await this.datasource.initialize();
            this.isConnected = true;
            console.log(`Database connection established successfully`);
            return this.datasource;
        } catch (error) {
            console.error("Error connecting to PostgreSQL database:", error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if(!this.isConnected) {
            console.log("Database is not connected.");
            return;
        }

        try {
            await this.datasource.destroy();
            this.isConnected = false;
            console.log("Database connection closed successfully.");
        } catch (error) {
            console.log("Error closing database connection:", error);
            throw error;
        }
    }

    public getDataSource(): DataSource {
        if (!this.isConnected) {
            throw new Error("Database is not connected. Please connect first.");
        }

        return this.datasource
    }
}