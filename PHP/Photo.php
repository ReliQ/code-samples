<?php
/**
 *  Photo model. A Laravel model for photo management.
 *
 *  @author Patrick Reid (@IAmReliQ)
 *  @since  2014 
 *  @uses   Intervention\Image\Facades\Image
 *  @updated 2016
 */

namespace App;

use Str;
use File;
use URL;
use Validator;
use Illuminate\Database\Eloquent\Model;
use App\ViewModels\ResultVM as PhotoResult;

/**
 *  Photo model. Provides optimized photo upload and generation.
 *  Named Photo to remove all possible conflict with Intervention\Image\Facades\Image.
 *  Utilizes Laravel's morphing functionality which allows several models to relate to
 *  a single model, hence "morphing" that model.
 *
 *  @author Patrick Reid (@IAmReliQ)
 *  @since  2014 
 *  @uses   Intervention\Image\Facades\Image
 */
class Photo extends Model
{
    public static $rules = ['file' => 'required|mimes:png,gif,jpeg|max:2048'];
    public static $upload_dir = 'uploads/images';

    /**
     *  Images table.
     */
    protected $table = 'images';

    /**
     *  Set guard.
     */
    protected $guarded = ['id', 'created_at', 'updated_at'];

    /**
     *  User - image relationship.
     */
    public function creator()
    {
        return $this->belongsTo('App\User', 'creator_id');
    }

    /**
     *  Projects.
     */
    public function projects()
    {
        return $this->morphedByMany('App\Project', 'imageable');
    }

    /**
     *  Posts.
     */
    public function posts()
    {
        return $this->morphedByMany('App\Post', 'imageable');
    }

    /**
     *  Removes image from database, and filesystem, if not in use.
     *  @param $safe_num    A photo is safe to delete if it is used by $safe_num amount of records.
     *  @param $force       Override safety constraints.
     */
    public function remove($safe_num = 1, $force = false)
    {
        $result = new PhotoResult();
        $img_name = $this->name;
        $safe = false;
        $projects = Project::withTrashed()->where('photo_id', $this->id)->get();
        $projects = $this->projects->merge($projects);
        $usage = $projects->count();

        // determine if safe
        if ($usage <= $safe_num) {
            $safe = true;
        }

        if ($safe || $force) {
            if (File::delete(urldecode($this->full_path))) {
                $this->delete();
            }
            $result->success = true;
        } else {
            $result->message = 'Not safe for delete.';
        }

        return $result;
    }

    /**
     *  Get ready URL to image.
     */
    public function url()
    {
        return urldecode($this->full_path);
    }

    /**
     *  Get ready URL to image.
     */
    public function title()
    {
        return Str::title(preg_replace("/[\-_]/", ' ', $this->name));
    }

    /**
     * Get routed link to photo.
     */
    public function routeResized($params = false, $type = 'resize')
    {
        if (!(in_array($type, ['resize', 'thumb'])) && is_array($params)) {
            return $this->url();
        }
        array_unshift($params, $this->id);

        return route("photo.$type", $params);
    }

    /**
     *  Upload and save image.
     */
    public static function upload($imageFile)
    {
        $validator = Validator::make(['file' => $imageFile], self::$rules);
        $result = new PhotoResult();

        if ($validator->passes()) {
            $full_name = $imageFile->getClientOriginalName();
            $file_spl = pathinfo($full_name);
            $filename = Str::slug($file_spl['filename']);
            $existing = self::where('name', $filename)
                                ->where('size', $imageFile->getSize());

            if (!$existing->count()) {
                $im['extension'] = $imageFile->getClientOriginalExtension();
                $im['mime_type'] = $imageFile->getMimeType();
                $im['size'] = $imageFile->getSize();
                $im['name'] = $filename;
                $im['location'] = self::$upload_dir;
                $im['creator_id'] = auth()->user()->id;
                $im['full_path'] = urlencode($im['location'].'/'.$filename.'.'.$im['extension']);
                list($im['width'], $im['height']) = getimagesize($imageFile);

                try {
                    $file = $imageFile->move($im['location'], $im['name'].'.'.$im['extension']);
                    $newImage = new self();

                    // file moved, save
                    $newImage->fill($im);
                    if ($newImage->save()) {
                        $result->success = true;
                        $result->extra = $newImage;
                    }
                } catch (Exception $e) {
                    $result->error = $e->getMessage();
                }
            } else {
                $result->success = true;
                $result->extra = $existing->first();
                $result->message = 'Image reused.';
            }
        } else {
            $result->error = 'Image not valid.';
            $result->message = 'Image not valid. Please check size.';
        }

        return $result;
    }
}
