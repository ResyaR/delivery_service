import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOrderNumberToOrders1766000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add orderNumber column to orders table
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'orderNumber',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );

    // Generate orderNumber format MT-XXXXXX untuk existing orders (kombinasi huruf dan angka)
    const orders = await queryRunner.query(`
      SELECT id FROM orders ORDER BY "createdAt" ASC
    `);

    const usedCodes = new Set<string>();
    
    // Function to generate random alphanumeric code
    const generateRandomCode = (length: number): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    for (const order of orders) {
      let orderNumber: string = '';
      let isUnique = false;
      let attempts = 0;
      
      // Generate unique random alphanumeric code
      while (!isUnique && attempts < 20) {
        const randomCode = generateRandomCode(6);
        const candidateNumber = `MT-${randomCode}`;
        
        if (!usedCodes.has(candidateNumber)) {
          isUnique = true;
          orderNumber = candidateNumber;
          usedCodes.add(orderNumber);
        }
        attempts++;
      }
      
      // Fallback to timestamp-based code if all attempts failed
      if (!isUnique || !orderNumber) {
        const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
        orderNumber = `MT-${timestamp}`;
        // Ensure uniqueness even for timestamp
        let counter = 0;
        while (usedCodes.has(orderNumber) && counter < 100) {
          orderNumber = `MT-${timestamp}${counter}`;
          counter++;
        }
        usedCodes.add(orderNumber);
      }
      
      await queryRunner.query(`
        UPDATE orders 
        SET "orderNumber" = $1 
        WHERE id = $2
      `, [orderNumber, order.id]);
    }

    // Create unique index for orderNumber (must be globally unique)
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_orders_orderNumber" 
      ON orders ("orderNumber")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'orderNumber');
  }
}

