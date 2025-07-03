export declare class TenantUtils {
    /**
     * Gera um tenant ID único baseado no nome da clínica
     */
    static generateTenantId(nome: string): string;
    /**
     * Verifica se um tenant ID já existe
     */
    static isTenantIdUnique(tenantId: string): Promise<boolean>;
    /**
     * Gera um tenant ID único garantindo que não existe no banco
     */
    static generateUniqueTenantId(nome: string): Promise<string>;
    /**
     * Valida formato de um tenant ID
     */
    static validateTenantId(tenantId: string): boolean;
}
