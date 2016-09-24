/**
 *  List WP posts by tags and categories.
 *  Optionally creating a view.
 *  @author ReliQ (@IAmReliQ)
 */


SET group_concat_max_len = 2048;
-- CREATE VIEW view_post_tags_2_rq AS
SELECT po.ID, po.post_title AS Title, po.post_name, po.guid, 
    COUNT(CASE tt.taxonomy WHEN 'post_tag' THEN 1 ELSE NULL END) AS "Tag Count",
    COUNT(CASE tt.taxonomy WHEN 'category' THEN 1 ELSE NULL END) AS "Category Count",
    GROUP_CONCAT(CASE tt.taxonomy WHEN 'post_tag' THEN t.name ELSE NULL END) AS Tags,
    GROUP_CONCAT(CASE tt.taxonomy WHEN 'category' THEN t.name ELSE NULL END) AS Categories
FROM wp_posts po
JOIN wp_term_relationships tr ON tr.object_id = po.ID
JOIN wp_term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
JOIN wp_terms t ON t.term_id = tt.term_id 
WHERE po.post_status = 'publish'
GROUP BY po.ID
ORDER BY `Tag Count` ASC, `Category Count` ASC
