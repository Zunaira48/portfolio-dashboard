using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortfolioApi.Migrations
{
    /// <inheritdoc />
    public partial class ConvertResponsibilitiesToRichText : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add a temporary text column for the new rich-text representation.
            migrationBuilder.AddColumn<string>(
                name: "Responsibilities_RichText",
                table: "Experiences",
                type: "text",
                nullable: false,
                defaultValue: "");

            // Convert the existing PostgreSQL text[] values into HTML rich text.
            //
            // Example:
            // ["Responsibility A", "Responsibility B"]
            //
            // becomes:
            // <ul><li>Responsibility A</li><li>Responsibility B</li></ul>
            migrationBuilder.Sql("""
                UPDATE "Experiences"
                SET "Responsibilities_RichText" =
                    CASE
                        WHEN "Responsibilities" IS NULL
                             OR cardinality("Responsibilities") = 0
                        THEN ''
                        ELSE
                            '<ul>' ||
                            (
                                SELECT string_agg(
                                    '<li>' ||
                                    replace(
                                        replace(
                                            replace(value, '&', '&amp;'),
                                            '<', '&lt;'
                                        ),
                                        '>', '&gt;'
                                    ) ||
                                    '</li>',
                                    ''
                                    ORDER BY ord
                                )
                                FROM unnest("Responsibilities") WITH ORDINALITY AS items(value, ord)
                            ) ||
                            '</ul>'
                    END;
                """);

            // Remove the old text[] column.
            migrationBuilder.DropColumn(
                name: "Responsibilities",
                table: "Experiences");

            // Rename the converted rich-text column to the original property name.
            migrationBuilder.RenameColumn(
                name: "Responsibilities_RichText",
                table: "Experiences",
                newName: "Responsibilities");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Add a temporary text[] column.
            migrationBuilder.AddColumn<string[]>(
                name: "Responsibilities_Array",
                table: "Experiences",
                type: "text[]",
                nullable: false,
                defaultValueSql: "ARRAY[]::text[]");

            // Convert the HTML rich text back into an array.
            //
            // This reverse conversion is primarily for rollback purposes.
            migrationBuilder.Sql("""
                UPDATE "Experiences"
                SET "Responsibilities_Array" =
                    CASE
                        WHEN "Responsibilities" IS NULL
                             OR "Responsibilities" = ''
                        THEN ARRAY[]::text[]
                        ELSE
                            ARRAY(
                                SELECT regexp_replace(
                                    regexp_replace(
                                        regexp_replace(
                                            value,
                                            '&amp;', '&', 'g'
                                        ),
                                        '&lt;', '<', 'g'
                                    ),
                                    '&gt;', '>', 'g'
                                )
                                FROM regexp_matches(
                                    "Responsibilities",
                                    '<li>(.*?)</li>',
                                    'g'
                                ) AS matches(value)
                            )
                    END;
                """);

            migrationBuilder.DropColumn(
                name: "Responsibilities",
                table: "Experiences");

            migrationBuilder.RenameColumn(
                name: "Responsibilities_Array",
                table: "Experiences",
                newName: "Responsibilities");
        }
    }
}
