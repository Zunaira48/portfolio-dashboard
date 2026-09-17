using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortfolioApi.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectArchitectureFlow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "ArchitectureFlow",
                table: "Projects",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArchitectureFlow",
                table: "Projects");
        }
    }
}
