Sanity MCP server

Copy article
Enable AI assistants to interact with your Sanity workspace through the Model Context Protocol (MCP).

The Sanity Model Context Protocol (MCP) server provides AI assistants like Claude Code and Cursor with direct, authenticated access to your Sanity projects. Instead of manually writing API calls or copying documentation, AI assistants can discover and use Sanity tools automatically through a standardized protocol.

Experimental feature
This article describes an experimental Sanity feature. The APIs described are subject to change and the documentation may not be completely accurate.

Prerequisites:

An MCP-compatible client, such as Claude Code or Cursor.
Remote server
The Sanity MCP server is hosted on Sanity's infrastructure, follows Anthropic's official MCP specification, and should work with any MCP clients. Follow the documentation for your client for how to add MCP servers. Typically, you add a section like the following to the relevant configuration file:

{
  "mcpServers": {
    "Sanity": {
      "url": "https://mcp.sanity.io",
      "type": "http"
    }
  }
}

Claude Code
Use Claude's HTTP transport method to add Sanity.

claude mcp add sanity -t http https://mcp.sanity.io

Cursor

Cursor MCP server list interface
Use the following link to directly install the MCP server in Cursor. Once installed, you'll be prompted to authorize access. You can confirm tool availability using the command palette and choosing "Open MCP settings".

Add to Cursor →

Alternatively, you can update your mcp.json configuration with the following:

mcp.json
{
  "mcpServers": {
      "Sanity": {
      "url": "https://mcp.sanity.io",
      "type": "http"
    }
  }
}

Other clients
If your client does not support remote MCP servers, you may be able to use a proxy such as mcp-remote.

{
  "mcpServers": {
    "Sanity": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.sanity.io",
        "--transport",
        "http-first"
      ]
    }
  }
}

Authorization
The Sanity MCP server uses OAuth by default to perform operations on your behalf. You may instead provide an API token by setting the Authorization header in your MCP config. When configured with the header, the server will not use OAuth and tool calls will use the API token in accordance with its role and scoped to its permissions.

mcp.json
{
  "mcpServers": {
    "Sanity": {
      "url": "https://mcp.sanity.io",
      "headers": {
        "Authorization": "Bearer sk..."
      }
    }
  }
}

You can create API tokens from sanity.io/manage or with the sanity CLI's tokens command. You can also provide a personal token, which will share your role and permissions, as well as link you to any changes in the revision history.

Run commands (or tools)
Once configured and started, authenticate with your Sanity credentials if prompted. You can then use natural language to work with Sanity development tasks, such as:

Help me migrate this project to Sanity.
Run a GROQ query for all articles written by Mark.
Add localization to my article document type.
Help me migrate existing content to a new schema shape.
List all releases in this dataset.
mcp.sanity.io provides both editorial and development-focused tools for content operations, schema exploration, GROQ query execution, project management such as creating and managing resources like datasets and api keys, and providing migration assistance. These tools allow your AI assistant to interact with your Sanity data directly.

Available tools
The following is a list of available tools and their uses:

get_groq_specification
Get the GROQ language specification summary

create_document
Creates new documents by transforming raw markdown content and formatting instructions

create_version
Create a version of an existing document for a specific release, with optional AI-generated modifications

transform_image
Transform or generate images in documents using AI. Automatically targets the image asset for transformation or generation. Use "transform" for modifying existing images or "generate" for creating new images.

patch_document
Apply precise, direct modifications to document fields. Use for exact value changes, adding/removing specific items, or when you know exactly what needs to be changed.

update_document
Update existing document content using AI to rewrite, expand, or modify based on natural language instructions. Best for general content updates, rewrites, and improvements where you want AI to interpret and generate new content.

transform_document
Transform existing content while preserving rich text formatting, annotations, and structure. Use for find-and-replace operations, style corrections, or content modifications where maintaining original formatting is crucial. Choose over "update_document" when formatting preservation is important.

translate_document
Translate document content to a different language while preserving formatting and structure. Specifically designed for language translation with support for protected phrases and style guides. Always use this instead of other tools for translation tasks.

query_documents
Query documents from Sanity using GROQ query language

publish_document
Publish a draft document to make it live

unpublish_document
Unpublish a published document (moves it back to drafts)

version_replace_document
Replace the contents of a document version with contents from another document

version_discard_document
Discard a document version from a release (removes it from the release)

version_unpublish_document
Mark a document to be unpublished when the release is run

delete_document
Permanently delete a document and all its drafts

list_projects
Lists all Sanity projects associated with your account

get_project_studios
Retrieves all studio applications linked to a specific Sanity project

get_schema
Get the full schema of the current Sanity workspace

list_workspace_schemas
Get a list of all available workspace schema names

list_datasets
Lists all datasets in your Sanity project

create_dataset
Creates a new dataset with specified name and access settings

update_dataset
Modifies a dataset's name or access control settings

list_releases
List content releases in Sanity, optionally filtered by state (active, scheduled, etc)

create_release
Create a new content release in Sanity with an automatically generated ID

edit_release
Update metadata for an existing content release

schedule_release
Schedule a content release to be published at a specific time

publish_release
Publish a release immediately

archive_release
Archive a release that is no longer active

unarchive_release
Restore an archived release

unschedule_release
Remove a previously set schedule from a release

delete_release
Delete a release

list_embeddings_indices
List all available embeddings indices for a dataset

semantic_search
Perform a semantic search on an embeddings index

get_context
Get project-specific context for a Sanity project and dataset, including available schemas, releases, and embeddings.

sanity_migration_guide
Get comprehensive guidance for migrating existing projects to Sanity, including content modeling analysis and step-by-step migration instructions. Use this tool when users want to migrate their existing CMS or content system to Sanity.

migrate_schema
Get platform-specific guidance for analyzing existing content structures and designing Sanity schemas. Provides detailed instructions for content modeling and schema conversion from various CMS platforms.

migrate_content
Get platform-specific guidance for migrating content from various CMS platforms (like Contentful, WordPress, Strapi) to Sanity. Provides detailed instructions for content transfer after schemas are designed.

list_learn_docs
List documentation and learning materials from Sanity

read_learn_docs
Read documentation and learning materials by slug and type, rendered as markdown

read_docs
Read a specific Sanity documentation article

search_docs
Search Sanity docs

Troubleshooting
Authentication issues: Ensure you have valid Sanity credentials and necessary permissions. Sessions expire after 7 days. Your client should automatically refresh tokens when needed. If it doesn't, check the MCP list in your client.

For vscode you can solve some authentication issues by running

Authentication: Remove Dynamic Authentication Providers from the command palette, resetting the relevant authentication provider, and starting the server again. In Cursor this command is called Cursor: Clear All MCP Tokens.

Tool availability: Verify project permissions and dataset access for the operation you're attempting. The set of tools available will vary over time as we add new or update existing tools.

Support
Join us in the Sanity community to ask questions and discuss our MCP server with other developers.

