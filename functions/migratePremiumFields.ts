import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        // Get all trades
        const trades = await base44.asServiceRole.entities.Trade.list(null, 1000);
        
        let migratedCount = 0;

        // Migrate each trade that has old field names
        for (const trade of trades) {
            let updateData = {};
            let needsUpdate = false;

            // Check if old fields exist and migrate them
            if (trade.open_premium !== undefined && trade.open_price === undefined) {
                updateData.open_price = trade.open_premium;
                needsUpdate = true;
            }

            if (trade.close_premium !== undefined && trade.latest_value === undefined) {
                updateData.latest_value = trade.close_premium;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await base44.asServiceRole.entities.Trade.update(trade.id, updateData);
                migratedCount++;
            }
        }

        return Response.json({ 
            success: true, 
            migratedCount,
            message: `Successfully migrated ${migratedCount} trades`
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});